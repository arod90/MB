'use client';
// import { useEffect, useRef, useState } from 'react';
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);
// import 'chartjs-adapter-moment';
// // import data from '../../mocks/infoSemana.json';
// import fetchDateRangeData from '../../utils/fetchDateRangeData';

// function LineChart({ startDate, endDate }) {
//   const [data, setData] = useState(null);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     fetchDateRangeData(startDate, endDate).then((fetchedData) => {
//       setData(fetchedData.data.Noches);
//       console.log('DATA  LINE CHART', fetchedData.data.Noches);
//     });
//   }, [endDate]);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = new Chart(chartRef.current, {
//         type: 'line',
//         data: {
//           labels:
//             data &&
//             data.map((item) => {
//               const date = item.fecha.split('T')[0];
//               return new Date(date);
//             }),
//           datasets: [
//             {
//               label: 'Facturacion del dia',
//               data: data && data.map((item) => item.facturacion_dia.total),
//               borderWidth: 5, // make the line thicker
//               pointRadius: 8, // make the points bigger
//               fill: false,
//               backgroundColor: 'rgb(75, 192, 192)',
//               borderColor: 'rgba(75, 192, 192, 0.2)',
//             },
//           ],
//         },
//         options: {
//           scales: {
//             x: {
//               type: 'time',
//               time: {
//                 parser: 'YYYY-MM-DD',
//                 unit: 'day',
//                 displayFormats: {
//                   day: 'MMM D',
//                 },
//               },
//               ticks: {
//                 source: 'labels',
//               },
//             },
//           },
//           plugins: {
//             tooltip: {
//               callbacks: {
//                 footer: function (tooltipItems) {
//                   const tooltipItem = tooltipItems[0];
//                   const originalItem = data[tooltipItem.dataIndex]; // Access the original data structure

//                   // Check if originalItem and originalItem.dj exist before trying to access properties
//                   if (!originalItem || !originalItem.dj) {
//                     console.log(
//                       'originalItem or originalItem.dj is undefined',
//                       originalItem
//                     );
//                     return '';
//                   }
//                   const promocionesArray = Object.entries(
//                     originalItem.promociones
//                   ).map(([key, value]) => `${key}: ${value}`);

//                   return [
//                     `DJ Turno 1: ${originalItem.dj.turno1}`,
//                     `DJ Turno 2: ${originalItem.dj.turno2}`,
//                     ...promocionesArray,
//                   ];
//                 },
//               },
//             },
//           },
//         },
//       });

//       return () => chart.destroy();
//     }
//   }, []);

//   return <canvas ref={chartRef} />;
// }

// export default LineChart;
import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'chartjs-adapter-moment';

import fetchDateRangeData from '../../utils/fetchDateRangeData';

function LineChart({ startDate, endDate }) {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchDateRangeData(startDate, endDate).then((fetchedData) => {
      const normalizedData = fetchedData.data.Noches.map((item) => ({
        fecha: item.Fecha,
        edades: item.edades,
        estado_civil: item.estado_civil,
        genero: {
          masculino: item.genero.m,
          femenino: item.genero.f,
        },
        facturacion_dia: { total: item.facturacion_dia?.total || 0 },
        promociones: item.promociones || {},
        dj: item.dj || { turno1: 'N/A', turno2: 'N/A' },
      }));
      setData(normalizedData);
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (data && chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: data.map((item) => new Date(item.fecha)),
          datasets: [
            {
              label: 'Facturación del día',
              data: data.map((item) => item.facturacion_dia.total),
              borderWidth: 5,
              pointRadius: 8,
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
                  const originalItem = data[tooltipItem.dataIndex];
                  if (!originalItem) return [];

                  const edades = Object.entries(originalItem.edades).map(
                    ([ageRange, count]) => `${ageRange}: ${count}`
                  );
                  const estadoCivil = Object.entries(
                    originalItem.estado_civil
                  ).map(([status, count]) => `${status}: ${count}`);
                  const generos = Object.entries(originalItem.genero).map(
                    ([gender, count]) =>
                      `${gender === 'masculino' ? 'Male' : 'Female'}: ${count}`
                  );
                  const promocionesArray = Object.entries(
                    originalItem.promociones
                  ).map(([key, value]) => `${key}: ${value}`);
                  const djInfo = [
                    `DJ Turno 1: ${originalItem.dj.turno1}`,
                    `DJ Turno 2: ${originalItem.dj.turno2}`,
                  ];

                  return [
                    'Edades: ' + edades.join(', '),
                    'Estado Civil: ' + estadoCivil.join(', '),
                    'Género: ' + generos.join(', '),
                    ...djInfo,
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
  }, [data]);

  return <canvas ref={chartRef} />;
}

export default LineChart;
