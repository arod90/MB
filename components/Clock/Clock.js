'use client';
import React, { useState, useEffect } from 'react';
import './Clock.css';

function Clock() {
  const [date] = useState(new Date());
  // const [date, setDate] = useState(new Date());

  // // Update the date state every second
  // useEffect(() => {
  //   const timerID = setInterval(() => {
  //     setDate(new Date());
  //   }, 1000);

  //   // Clean up on component unmount
  //   return () => {
  //     clearInterval(timerID);
  //   };
  // }, []);

  return (
    <div className="clock-cont">
      <h2>
        {date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </h2>
      {/* <h3>{date.toLocaleTimeString()}</h3> */}
    </div>
  );
}

export default Clock;
