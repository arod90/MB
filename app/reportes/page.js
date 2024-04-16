'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import LineChart from '../../components/InfoCharts/LineChart';
import DayChart from '../../components/InfoCharts/DayChart';
import 'react-date-range/dist/styles.css'; // Ensure these CSS imports are correct
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';
import { es } from 'date-fns/locale'; // Importing Spanish locale
import useWindowSize from '../../hooks/useWindowSize';
import { defineStaticRanges } from 'react-date-range';

const Reportes = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const pickerRef = useRef(null);
  const size = useWindowSize();

  const handleSelect = (ranges) => {
    setState([ranges.selection]);
  };

  const togglePicker = () => {
    setIsVisible((prev) => !prev);
  };

  const monthsToShow = size.width <= 768 ? 1 : 2;

  const formatDates = () => {
    const { startDate, endDate } = state[0];
    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return format(startDate, 'PPP', { locale: es }); // Formatting date in Spanish
    } else {
      return `${format(startDate, 'PPP', { locale: es })} - ${format(
        endDate,
        'PPP',
        { locale: es }
      )}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section>
      <button
        className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={togglePicker}
      >
        Select Dates
      </button>
      <span className="ml-3 text-sm text-gray-700">{formatDates()}</span>
      {isVisible && <div className="backdrop"></div>}
      {isVisible && (
        <div ref={pickerRef} style={{ position: 'absolute', zIndex: 1000 }}>
          <DateRangePicker
            onChange={handleSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={monthsToShow}
            ranges={state}
            direction="horizontal"
            locale={es} // Apply Spanish locale
            inputRanges={[]}
          />
        </div>
      )}
      {format(state[0].startDate, 'yyyy-MM-dd') ===
      format(state[0].endDate, 'yyyy-MM-dd') ? (
        <DayChart date={state[0].startDate} />
      ) : (
        <LineChart startDate={state[0].startDate} endDate={state[0].endDate} />
      )}
    </section>
  );
};

export default Reportes;
