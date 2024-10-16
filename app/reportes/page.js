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
import DayView from '@/components/DayView/DayView';

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

  // const formatDates = () => {
  //   const { startDate, endDate } = state[0];
  //   if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
  //     return format(startDate, 'PPP', { locale: es }); // Formatting date in Spanish
  //   } else {
  //     return `${format(startDate, 'PPP', { locale: es })} - ${format(
  //       endDate,
  //       'PPP',
  //       { locale: es }
  //     )}`;
  //   }
  // };

  const formatDates = () => {
    const { startDate, endDate } = state[0];
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return format(start, 'dd-MM-yyyy'); // Formatting date in DD-MM-YYYY format
    } else {
      return `${format(start, 'dd-MM-yyyy')} - ${format(end, 'dd-MM-yyyy')}`;
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
    <section className="h-full">
      <button
        className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={togglePicker}
      >
        Select Dates
      </button>
      <span className="ml-3 text-sm text-gray-700">{formatDates()}</span>
      {isVisible && <div className="backdrop"></div>}
      {isVisible && (
        <div
          ref={pickerRef}
          className="fadeInSlideUp mt-10"
          style={{
            position: 'absolute',
            zIndex: 1000,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
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
      {format(state[0].startDate, 'dd-MM-yyyy') ===
      format(state[0].endDate, 'dd-MM-yyyy') ? (
        <div className="w-full h-full">
          <DayView date={state[0].startDate} />
        </div>
      ) : (
        <LineChart
          startDate={format(state[0].startDate, 'dd-MM-yyyy')}
          endDate={format(state[0].endDate, 'dd-MM-yyyy')}
        />
      )}
    </section>
  );
};

export default Reportes;
