'use client';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import LineChart from '../../components/InfoCharts/LineChart';
import DayChart from '../../components/InfoCharts/DayChart';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';
import useWindowSize from '../../hooks/useWindowSize';

const reportes = () => {
  // State to store the selected date or range
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const size = useWindowSize(); // Custom hook to get window size
  const handleSelect = (ranges) => {
    setState([ranges.selection]);
  };

  // Check window size to decide on the number of months to show
  const monthsToShow = size.width <= 768 ? 1 : 2;

  // Determine if a single day or a range of days is selected
  const isSelectedSingleDay = () => {
    const { startDate, endDate } = state[0];
    return format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
  };

  return (
    <section>
      <DateRangePicker
        onChange={handleSelect}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={monthsToShow}
        ranges={state}
        direction="horizontal"
        inputRanges={[]}
      />
      {isSelectedSingleDay() ? (
        <DayChart date={state[0].startDate} />
      ) : (
        <LineChart startDate={state[0].startDate} endDate={state[0].endDate} />
      )}
      {/* <LineChart /> */}
    </section>
  );
};

export default reportes;
