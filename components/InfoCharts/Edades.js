'use client';
import React, { useEffect, useRef } from 'react';
import data from '../../mocks/infoNoche.json';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function Edades({ data }) {
  const chartRef = useRef(null);
  let myChart = null; // variable to hold the chart instance

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // If there's a chart already, destroy it
      if (myChart) {
        myChart.destroy();
      }

      // Create a new chart
      myChart = new Chart(ctx, {
        type: 'bar', // change this to the type of chart you want
        data: {
          labels: Object.keys(data), // use the keys from the "edades" section as labels
          datasets: [
            {
              label: 'Edades', // label for the dataset
              data: Object.values(data), // use the values from the "edades" section as data
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // color of the bars
              borderColor: 'rgba(75, 192, 192, 1)', // color of the bar borders
              borderWidth: 1, // width of the bar borders
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Distribucion de edades',
              align: 'center',
              font: {
                size: 20,
              },
            },
            datalabels: {
              align: 'end',
              anchor: 'end',
              color: '#000000',
              formatter: function (value, context) {
                return value;
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, []);

  return <canvas ref={chartRef} />;
}

export default Edades;
