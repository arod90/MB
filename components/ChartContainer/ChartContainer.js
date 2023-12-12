import React from 'react';
import Edades from '../InfoCharts/Edades';
import './ChartContainer.css';
import Genero from '../InfoCharts/Genero';
import EstadoCivilChart from '../InfoCharts/EstadoCivil';

const ChartContainer = () => {
  return (
    <div className="chart-container">
      <div className="top-row">
        <div className="chart-cont">
          <Edades />
        </div>
        <div className="chart-cont">
          <Genero />
        </div>
        <div className="chart-cont">
          <EstadoCivilChart />
        </div>
      </div>
      <div className="bottom-row"></div>
    </div>
  );
};

export default ChartContainer;
