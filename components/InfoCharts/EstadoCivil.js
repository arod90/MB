'use client';
import React, { useEffect, useRef } from 'react';
import data from '../../mocks/infoNoche.json';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function EstadoCivil() {
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
        indexAxis: 'x',
        data: {
          labels: Object.keys(data.estado_civil), // use the keys from the "estado_civil" section as labels
          datasets: [
            {
              label: 'Estado Civil', // label for the dataset
              data: Object.values(data.estado_civil), // use the values from the "estado_civil" section as data
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(192, 75, 75, 0.2)',
                'rgba(75, 75, 192, 0.2)',
              ], // color of the bars
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(192, 75, 75, 1)',
                'rgba(75, 75, 192, 1)',
              ], // color of the bar borders
              borderWidth: 1, // width of the bar borders
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Distribucion de estado civil',
              align: 'center',
              font: {
                size: 20,
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, []);

  return <canvas ref={chartRef} />;
}

export default EstadoCivil;
