import React from 'react';
import Edades from '../InfoCharts/Edades';
import './ChartContainer.css';
import Genero from '../InfoCharts/Genero';
import EstadoCivilChart from '../InfoCharts/EstadoCivil';
import Facturacion from '../InfoCharts/Facturacion';
import DjPromoForm from '../InfoCharts/DjPromoForm';

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
      <div className="bottom-row">
        <div className="chart-cont">
          <Facturacion />
        </div>
        <div className="chart-cont">
          <DjPromoForm />
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
