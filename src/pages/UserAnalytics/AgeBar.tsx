import React,{useState,useEffect} from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
const AgeBar = ({ dataColors, ageRange,series } : any) => {
  console.log(series)
  var linechartcustomerColors = getChartColorsArray(dataColors);
//   const [state, setState] = React.useState({
          
//     series:  [
//       {
//         name: "Population",   // 👈 give it a name
//         data: series
//       }
//     ],
//     options: {
//       chart: {
//         type: 'bar',
//         height: 350,
//         toolbar: {
//                     show: false
//               },
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: 4,
//           borderRadiusApplication: 'end',
//           horizontal: false,
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       xaxis: {
//         categories: ageRange
//       },
//       colors: linechartcustomerColors,
//     },
  
  
// });

  const [state, setState] = useState<any>(null);
  useEffect(()=>{
    setState({
      series:series,
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: 'end', // 'around', 'end'
            borderRadiusWhenStacked: 'last', // 'all', 'last'
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        xaxis: {
          categories: ageRange,
        },
        legend: {
          show: true,
          horizontalAlign: "center",
          offsetX: 0,
          offsetY: -5,
          markers: {
            width: 9,
            height: 9,
            radius: 6,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 0,
          },
        },
        fill: {
          opacity: 1
        },
        colors: linechartcustomerColors,
      },
    
    
  })

  },[series])
  

  
console.log("state",state)
  return (
    <div>
      <div id="chart">
          {state!=null?<ReactApexChart 
            options={state.options} 
            series={state.series} 
            type="bar"
            height={350} 
            className="apex-charts"
            />:"Loading.."}
        </div>
      <div id="html-dist"></div>
    </div>
  );
}
export default AgeBar;