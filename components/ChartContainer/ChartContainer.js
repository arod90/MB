import React from 'react';
import Edades from '../InfoCharts/Edades';
import './ChartContainer.css';
import Genero from '../InfoCharts/Genero';
import EstadoCivilChart from '../InfoCharts/EstadoCivil';
import Facturacion from '../InfoCharts/Facturacion';
import DjPromoForm from '../InfoCharts/DjPromoForm';
import data from '../../mocks/infoNoche.json';

const ChartContainer = () => {
  return (
    <div className="chart-container">
      <div className="top-row">
        <div className="chart-cont">
          <Edades data={data.edades} />
        </div>
        <div className="chart-cont">
          <Genero data={data.genero} />
        </div>
        <div className="chart-cont">
          <EstadoCivilChart data={data.estado_civil} />
        </div>
      </div>
      <div className="bottom-row">
        <div className="chart-cont">
          <Facturacion data={data.facturacion_dia} />
        </div>
        <div className="chart-cont">
          <DjPromoForm data={data.dj} />
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
