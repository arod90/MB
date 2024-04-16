'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'chartjs-adapter-moment';
import data from '../../mocks/infoSemana.json';

function LineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: data.map((item) => {
            const date = item.fecha.split('T')[0];
            return new Date(date);
          }),
          datasets: [
            {
              label: 'Facturacion del dia',
              data: data.map((item) => item.facturacion_dia.total),
              borderWidth: 5, // make the line thicker
              pointRadius: 8, // make the points bigger
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'YYYY-MM-DD',
                unit: 'day',
                displayFormats: {
                  day: 'MMM D',
                },
              },
              ticks: {
                source: 'labels',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                footer: function (tooltipItems) {
                  const tooltipItem = tooltipItems[0];
                  const originalItem = data[tooltipItem.dataIndex]; // Access the original data structure

                  // Check if originalItem and originalItem.dj exist before trying to access properties
                  if (!originalItem || !originalItem.dj) {
                    console.log(
                      'originalItem or originalItem.dj is undefined',
                      originalItem
                    );
                    return '';
                  }
                  const promocionesArray = Object.entries(
                    originalItem.promociones
                  ).map(([key, value]) => `${key}: ${value}`);

                  return [
                    `DJ Turno 1: ${originalItem.dj.turno1}`,
                    `DJ Turno 2: ${originalItem.dj.turno2}`,
                    ...promocionesArray,
                  ];
                },
              },
            },
          },
        },
      });

      return () => chart.destroy();
    }
  }, []);

  return <canvas ref={chartRef} />;
}

export default LineChart;
