'use client';
import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import data from '../../mocks/infoNoche.json';

function BarChart() {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState([]);

  useEffect(() => {
    // Function to prepare the tooltip data
    const prepareTooltipData = () => {
      return {
        Edades: Object.entries(data.edades).map(
          ([key, value]) => `${key}: ${value}`
        ),
        'Estado Civil': Object.entries(data.estado_civil).map(
          ([key, value]) => `${key}: ${value}`
        ),
        Genero: Object.entries(data.genero).map(
          ([key, value]) => `${key}: ${value}`
        ),
        Promociones: Object.entries(data.promociones).map(
          ([key, value]) => `${key}: ${value}`
        ),
        DJ: Object.entries(data.DJ).map(([key, value]) => `${key}: ${value}`),
      };
    };

    // Set the tooltip data in state
    setTooltipData(prepareTooltipData());

    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Facturacion del dia'],
          datasets: [
            {
              label: 'Facturacion del dia',
              data: [data.facturacion_dia.total],
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
              maxBarThickness: 80,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              maxBarThickness: 10,
            },
            y: {
              beginAtZero: true,
            },
          },
          // You can leave the tooltip options as is if you want to display the tooltip on hover as well.
        },
      });

      return () => chart.destroy();
    }
  }, []);

  return (
    <div className="h-full w-full flex day-cont">
      <div className="h-full w-full sm:w-5/12">
        <canvas
          ref={chartRef}
          style={{ position: 'relative', height: '75vh', width: '100%' }}
        />
      </div>
      <div className="tooltip-data-container w-full h-6/8 sm:w-7/12">
        {Object.entries(tooltipData).map(([category, values], index) => (
          <div key={index} className="category-box">
            <h3>{category}</h3>
            {values.map((value, idx) => (
              <div key={idx} className="data-entry">
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarChart;
