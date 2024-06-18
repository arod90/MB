'use client';
import React, { useEffect, useState } from 'react';
import DayChart from '../../components/InfoCharts/DayChart';
// import data from '../../mocks/infoNoche.json';
import fetchStartDateData from '../../utils/fetchStartDateData';

const DayView = ({ date }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchStartDateData(date).then((fetchedData) => {
      setData(fetchedData.data.Noches[0]);
      console.log('DATA DAYCHART', data);
      // !TODO NOT WORKING always passing todays date
    });
  }, [date]);

  return <div className="h-full">{data && <DayChart data={data} />}</div>;
};

export default DayView;
