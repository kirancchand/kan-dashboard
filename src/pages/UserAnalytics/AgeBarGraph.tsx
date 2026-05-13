import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import CountUp from "react-countup";
import { GETAGEBARGRAPHDATA } from './api';
import AgeBar from "./AgeBar";
interface Series {
  name: string;
  data: any[];
}
const AgeBarGraph = (props:any) => {

   const [chartData, setChartData] = useState<any>([]);
   const [seriesData, setSeriesData] = useState<any>([]);
   const [loading, setLoading] = useState(false);  // Loading state
   let ageRange=["0-10","11-20","21-30","31-40","41-50","51-60","61-70","71-80","81+"]
   let initialRequest={
    "query":props.selected,
    "ageRange":[
          { "key": ageRange[0], "from_": 0, "to_": 10 },
          { "key": ageRange[1], "from_": 11, "to_": 20 },
          { "key": ageRange[2], "from_": 21, "to_": 30 },
          { "key": ageRange[3], "from_": 31, "to_": 40 },
          { "key": ageRange[4], "from_": 41, "to_": 50 },
          { "key": ageRange[5], "from_": 51, "to_": 60 },
          { "key": ageRange[6], "from_": 61, "to_": 70 },
          { "key": ageRange[7], "from_": 71, "to_": 80 },
          { "key": ageRange[8], "from_": 81 }
        ]
      }

      function buildSeries(data:any) {
        console.log("data",data)
        // Collect categories (age ranges)
        const categories = data.map((item:any) => item.key);
      
        // Initialize gender-wise series
        const seriesMap:any = {};
      
        data.forEach((item:any) => {
          item.gender_distribution.buckets.forEach((bucket:any) => {
            if (!seriesMap[bucket.key]) {
              seriesMap[bucket.key] = [];
            }
          });
        });
      
        // Fill values per category (insert 0 if missing)
        data.forEach((item:any) => {
          const genders = item.gender_distribution.buckets.reduce((acc:any, b:any) => {
            acc[b.key] = b.doc_count;
            return acc;
          }, {});
      
          Object.keys(seriesMap).forEach(gender => {
            seriesMap[gender].push(genders[gender] || 0);
          });
        });
      
        // Convert to ApexCharts format
        const series = Object.keys(seriesMap).map(gender => ({
          name: gender,
          data: seriesMap[gender]
        }));
      
        return { categories, series };
      }
      
      const fetchData = async (reqData:any) => {
       console.log("reqData",reqData)
       setLoading(true);  // Set loading to true before the request
     
       try {
          const response = await fetch(GETAGEBARGRAPHDATA, {
               method: 'POST', // Specify the request method
               headers: {
                   'Content-Type': 'application/json' // Set the content type to JSON
               },
               body: JSON.stringify(reqData) // Convert the JavaScript object to a JSON string
           });
     
         if (!response.ok) {
           throw new Error('Failed to fetch data');
         }
         const result = await response.json();  // Parse JSON response
         const { categories, series } = buildSeries(result.ageBar);
         //  const series:Series={
        //   name:"",
        //   data:[]
        //  }
        // console.log(result);
        // let newSeries:any=[]
        //  result.ageBar.map((agebar:any)=>{
        
        //   newSeries.push(agebar.doc_count)
        //   // let series={
        //   //   name:agebar.key,
        //   //   data:doc_count
        //   // }
        //   // newSeries.push(series)
        //   // setSeriesData([...seriesData,series])
        //   // return series
        // })
        // console.log(totalSeries) 
        setSeriesData(series)
        // return series

        // console.log("newSeries",newSeries) 
         setChartData(result);  // Update the data state
       } catch (err:any) {
         console.log(err)
       } finally {
         setLoading(false);  // Set loading to false after the request
       }
     };

     useEffect(()=>{
         fetchData(initialRequest)
     },[props.selected])
  return (
 <Col xl={11}>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Age Bar Graph</h4>
          <div className="d-flex gap-1">
            <button type="button" className="btn btn-soft-primary btn-sm"
              //  onClick={() => { onChangeChartPeriod("all"); }}
               >
              ALL
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" 
              // onClick={() => { onChangeChartPeriod("male"); }}
              >
              Male
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" 
              // onClick={() => { onChangeChartPeriod("female"); }}
              >
              Female
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" 
              // onClick={() => { onChangeChartPeriod("other"); }}
              >
              Other
            </button>
          </div>
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1 text-success">
                  {/* <CountUp start={0} end={chartData?.countOfUnit} duration={3} separator="," /> */}
                </h5>
                <p className="text-muted mb-0">Total Units</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1 text-warning">
                  {/* <CountUp start={0} end={chartData?.countOfPeople} duration={3} separator="," /> */}
                </h5>
                <p className="text-muted mb-0">Number of People</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  {/* <CountUp start={0} end={chartData?.gender&&chartData?.gender.length>0?chartData?.gender[1]["doc_count"]:0} duration={3} /> */}
                </h5>
                <p className="text-muted mb-0">Male</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0 border-end-0">
                <h5 className="mb-1">
                  {/* <CountUp start={0} end={chartData?.gender&&chartData?.gender.length>0?chartData?.gender[0]["doc_count"]:0} duration={3} /> */}
                </h5>
                <p className="text-muted mb-0">Female</p>
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
            {seriesData.length>0?<AgeBar series={seriesData} ageRange={ageRange} dataColors='["--vz-primary", "--vz-success", "--vz-danger"]'/>:"Loading"}
              {/* <RevenueCharts series={chartData} dataColors='["--vz-primary", "--vz-success", "--vz-danger"]' /> */}
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AgeBarGraph;
