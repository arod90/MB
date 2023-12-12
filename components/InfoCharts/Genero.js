'use client';
import React, { useEffect, useRef } from 'react';
import data from '../../mocks/infoNoche.json';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function Genero() {
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
        type: 'pie', // change this to the type of chart you want
        data: {
          labels: Object.keys(data.genero), // use the keys from the "genero" section as labels
          datasets: [
            {
              label: 'Genero', // label for the dataset
              data: Object.values(data.genero), // use the values from the "genero" section as data
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(192, 75, 75, 0.2)',
              ], // color of the slices
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(192, 75, 75, 1)'], // color of the slice borders
              borderWidth: 1, // width of the slice borders
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Distribucion de genero',
              align: 'center',
              font: {
                size: 20,
              },
            },
          },
        },
      });
    }
  }, []);

  return <canvas ref={chartRef} />;
}

export default Genero;
