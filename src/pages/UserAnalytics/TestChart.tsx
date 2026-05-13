import React from 'react';
import Chart from 'react-apexcharts';

const TotalVsDuplicatesCharts = () => {
  // Sample data - adjust these values for your use case
  const totalRecords = 1000;
  const duplicates = 250;
  const unique = totalRecords - duplicates;

  // Donut Chart Configuration
  const donutOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    labels: ['Unique Records', 'Duplicates'],
    colors: ['#00E396', '#FF4560'],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Records',
              formatter: () => totalRecords.toLocaleString()
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val:any, opts:any) => {
        return Math.round(val) + '%'
      }
    },
    tooltip: {
      y: {
        formatter: (val:any) => val.toLocaleString() + ' records'
      }
    }
  };

  const donutSeries = [unique, duplicates];

  // Stacked Bar Chart Configuration
  const stackedBarOptions = {
    chart: {
      type: 'bar',
      height: 300,
      stacked: true,
      toolbar: {
        show: false
      }
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
      categories: ['Dataset'],
      min: 0,
      max: totalRecords, // This limits the axis to your actual total
      tickAmount: 5,
      title: {
        text: 'Number of Records'
      },
      labels: {
        formatter: function (val:any) {
          // Format labels to show actual numbers instead of "k" notation
          return Math.round(val).toLocaleString();
        }
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
  };

  const stackedBarSeries = [
    {
      name: 'Unique Records',
      data: [unique]
    },
    {
      name: 'Duplicates',
      data: [duplicates]
    }
  ];

  // Radial Bar Chart Configuration
  const radialBarOptions = {
    chart: {
      type: 'radialBar',
      height: 300
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        }
      }
    },
    colors: ['#FF4560', '#00E396'],
    labels: ['Duplicates', 'Unique'],
    legend: {
      show: true,
      floating: true,
      fontSize: '14px',
      position: 'left',
      offsetX: 50,
      offsetY: 10,
      labels: {
        useSeriesColors: true
      },
      formatter: function(seriesName:any, opts:any) {
        const values = [duplicates, unique];
        return seriesName + ': ' + values[opts.seriesIndex].toLocaleString();
      }
    },
    tooltip: {
      enabled: true,
      custom: function({series, seriesIndex, dataPointIndex, w}:any) {
        const values = [duplicates, unique];
        const labels = ['Duplicates', 'Unique'];
        return '<div class="px-3 py-2">' +
          '<span>' + labels[seriesIndex] + ': ' + values[seriesIndex].toLocaleString() + ' records</span>' +
          '</div>';
      }
    }
  };

  const radialBarSeries = [
    (duplicates / totalRecords) * 100,
    (unique / totalRecords) * 100
  ];

  // Summary Stats Component
  const SummaryStats = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-3">Data Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalRecords.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Records</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{unique.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Unique Records</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{duplicates.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Duplicates</div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-sm text-gray-600">
          Duplicate Rate: <span className="font-semibold">{((duplicates / totalRecords) * 100).toFixed(1)}%</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Total vs Duplicates Visualization</h1>
      
      <SummaryStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">🍩 Donut Chart</h2>
          <p className="text-sm text-gray-600 mb-4">Best for: Simple part-to-whole relationships</p>
          <Chart
            options={donutOptions}
            series={donutSeries}
            type="donut"
            height={300}
          />
          <div className="mt-4 text-xs text-gray-500">
            ✅ Intuitive, shows percentages clearly<br/>
            ✅ Great for single dataset comparison
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">📊 Stacked Bar</h2>
          <p className="text-sm text-gray-600 mb-4">Best for: Comparing multiple datasets</p>
          <Chart
            options={stackedBarOptions}
            series={stackedBarSeries}
            type="bar"
            height={300}
          />
          <div className="mt-4 text-xs text-gray-500">
            ✅ Easy to compare absolute values<br/>
            ✅ Scales well for multiple categories
          </div>
        </div>

        {/* Radial Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">🎯 Radial Bar</h2>
          <p className="text-sm text-gray-600 mb-4">Best for: Modern, engaging visualization</p>
          <Chart
            options={radialBarOptions}
            series={radialBarSeries}
            type="radialBar"
            height={300}
          />
          <div className="mt-4 text-xs text-gray-500">
            ✅ Visually appealing and modern<br/>
            ✅ Good for dashboards and presentations
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📝 Recommendations</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Choose Donut Chart if:</strong> You have a single dataset and want to emphasize the proportion of duplicates</p>
          <p><strong>Choose Stacked Bar if:</strong> You're comparing duplicate rates across multiple datasets or categories</p>
          <p><strong>Choose Radial Bar if:</strong> You want a modern look for dashboards or when space is limited</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">🔧 To customize this code:</h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Update the <code>totalRecords</code> and <code>duplicates</code> variables with your data</li>
          <li>• Modify colors in the <code>colors</code> arrays to match your brand</li>
          <li>• Add more data series for multiple categories in stacked bar</li>
          <li>• Install: <code>npm install react-apexcharts apexcharts</code></li>
        </ul>
      </div>
    </div>
  );
};

export default TotalVsDuplicatesCharts;