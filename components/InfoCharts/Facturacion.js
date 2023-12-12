import React from 'react';
import data from '../../mocks/infoNoche.json';
import './Facturacion.css';

const Facturacion = () => {
  return (
    <div className="facturacion-cont">
      <h1>Facturacion del dia</h1>
      <h1>{data.facturacion_dia.total}$</h1>
    </div>
  );
};

export default Facturacion;
