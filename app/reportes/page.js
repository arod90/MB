import React from 'react';
import WeekAggregate from '../../components/InfoCharts/WeekAggregate';

const reportes = () => {
  // Report page could display data aggregation, EXAMPLE: line graph with a node for every day of operation, click the node and it will
  // expand showing you that nights DJ/type of music, AFORO, promociones, who was there, identify key customers
  return (
    <section>
      <h1>Semana 2 Diciembre</h1>
      <WeekAggregate />
    </section>
  );
};

export default reportes;
