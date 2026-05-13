import React ,{useEffect, useState}from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col,CardHeader } from 'reactstrap';
import { ecomWidgets } from "../../common/data";
import { COUNTDUPLICATEBYID,DUPLICATEIDBYDETAILS } from './api';
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
interface CountData{
    totalCount:number;
    totalUniqueCount:number;
    totalDuplicate:number;
}
const DuplicateId = (props:any) => {
  const [loading, setLoading] = useState(false);  // Loading state
  const [data, setData] = useState<CountData|null>(null);
  const [state, setState] = useState<any>(null);
  let Colors='["#1ab7ea", "#FF4560"]' 
  console.log("props.selected",props.selected)
  // let initialRequest={
  //   "query":Array.from(props.selected)
  // }
     const fetchData = async (reqData:any) => {
      console.log("reqData",reqData)
      setLoading(true);  // Set loading to true before the request
    
      try {
         const response = await fetch(COUNTDUPLICATEBYID, {
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
        console.log("result",result)
        setData(result);  // Update the data state
      } catch (err:any) {
        console.log(err)
      } finally {
        setLoading(false);  // Set loading to false after the request
      }
    };

    useEffect(()=>{
        fetchData({
            "query":props.selected
          })
    },[props.selected])


  
    const downloadDuplicateData = async (reqData:any) => {
      console.log("reqData",reqData)
      setLoading(true);  // Set loading to true before the request
    
      try {
         const response = await fetch(DUPLICATEIDBYDETAILS, {
              method: 'POST', // Specify the request method
              headers: {
                  'Content-Type': 'application/json' // Set the content type to JSON
              },
              body: JSON.stringify(reqData) // Convert the JavaScript object to a JSON string
          });
    
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "duplicates.xlsx";
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);


        // const result = await response.json();  // Parse JSON response
        // console.log("result",result)
      } catch (err:any) {
        console.log(err)
      } finally {
        setLoading(false);  // Set loading to false after the request
      }
    };


    
      useEffect(()=>{
          if(data!=null){
              console.log("data",data)
              setState(                
                {
                series:[
                  {
                    name: 'Unique',
                    data: [data.totalUniqueCount]
                  },
                  {
                    name: 'Duplicates',
                    data: [data?.totalDuplicate]
                  }
                ],
                options:{
                  chart: {
                    type: 'bar',
                    height: 300,
                    stacked: true,
                    toolbar: {
                      show: false
                    },
                    events: {
                      dataPointSelection: (event:any, chartContext:any, config:any) => {
                        if(config.seriesIndex==1){
                          downloadDuplicateData({
                            "query":props.selected
                          })
                        }
                        console.log(config)
                        // const seriesIndex = config.seriesIndex;
                        // const seriesName = state.options.labels[seriesIndex];
                        // const seriesValue = state.series[seriesIndex];
                        // alert(`You clicked: ${seriesName} → ${seriesValue}`);
                      },
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      dataLabels: {
                        total: {
                          enabled: true,
                          offsetX: 0,
                          style: {
                            fontSize: '13px',
                            fontWeight: 900
                          }
                        }
                      }
                    }
                  },
                  xaxis: {
                    categories: ['Total'],
                    title: {
                      text: 'Number of Records'
                    }
                  },
                  yaxis: {
                    title: {
                      text: undefined
                    }
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                  },
                  colors: ['#00E396', '#FF4560'],
                  dataLabels: {
                    enabled: true,
                    formatter: (val:any) => val.toLocaleString()
                  },
                  tooltip: {
                    y: {
                      formatter: (val:any) => val.toLocaleString() + ' records'
                    }
                  }


                  
                }

              }
            
            )



          }

        

    
      },[data])





    // let Colors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'   
    // var chartDonutBasicColors = getChartColorsArray(Colors);
    // const series = [data?.totalCount, 55, 41, 17, 15];
    // var options : any = {
    //   labels: ["Direct", "Social", "Email", "Other", "Referrals"],
    //   chart: {
    //     height: 333,
    //     type: "donut",
    //   },
    //   legend: {
    //     position: "bottom",
    //   },
    //   stroke: {
    //     show: false,
    //   },
    //   dataLabels: {
    //     dropShadow: {
    //       enabled: false,
    //     },
    //   },
    //   colors: chartDonutBasicColors,
    // };


    return (

                <Col xl={11}>
                    <Card>
                    <CardHeader className="border-0 align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Duplicated Id</h4>
                    </CardHeader>
                        <CardBody>
                              
                        {state!=null?<ReactApexChart
                                                options={state.options}
                                                series={state.series}
                                                type="bar"
                                                height={300}
                                              />:"Loading.."}


                        </CardBody>
                    </Card>
                </Col>

    );
};

export default DuplicateId;