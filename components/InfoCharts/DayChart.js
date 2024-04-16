'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'chartjs-adapter-moment';
import data from '../../mocks/infoNoche.json';

function BarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Facturacion del dia'],
          datasets: [
            {
              label: 'Facturacion del dia',
              data: [data.facturacion_dia.total], // use the facturacion_dia.total value from infoNoche.json
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        },
        options: {
          scales: {
            x: {
              barPercentage: 0.4, // adjust the bar thickness //!not working
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                footer: function () {
                  // include the additional data in the tooltip
                  const edadesArray = Object.entries(data.edades).map(
                    ([key, value]) => `${key}: ${value}`
                  );
                  const estadoCivilArray = Object.entries(
                    data.estado_civil
                  ).map(([key, value]) => `${key}: ${value}`);
                  const generoArray = Object.entries(data.genero).map(
                    ([key, value]) => `${key}: ${value}`
                  );
                  const promocionesArray = Object.entries(data.promociones).map(
                    ([key, value]) => `${key}: ${value}`
                  );
                  const djArray = Object.entries(data.DJ).map(
                    ([key, value]) => `${key}: ${value}`
                  );

                  return [
                    'Edades',
                    ...edadesArray,
                    'Estado Civil',
                    ...estadoCivilArray,
                    'Genero',
                    ...generoArray,
                    'Promociones',
                    ...promocionesArray,
                    'DJ',
                    ...djArray,
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

export default BarChart;
