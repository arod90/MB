import React from 'react';
import DayChart from '../../components/InfoCharts/DayChart';
import data from '../../mocks/infoNoche.json';

const DayView = ({ date }) => {
  console.log(date);
  return (
    <div className="h-full">
      <DayChart date={data} />
    </div>
  );
};

export default DayView;
