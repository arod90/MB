'use client';
import React, { useState } from 'react';
import './DjPromoForm.css';

function DjPromoForm() {
  const [promociones, setPromociones] = useState('');
  const [dj, setDj] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(`Promociones: ${promociones}, DJ: ${dj}`);
  };

  return (
    <form className="DjPromoForm" onSubmit={handleSubmit}>
      <label>
        Promociones:
        <select
          value={promociones}
          onChange={(e) => setPromociones(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="Margaritas3x2">Margaritas3x2</option>
          <option value="Ladies Night">Ladies Night</option>
          <option value="15% Alimentos">15% Alimentos</option>
        </select>
      </label>
      <label>
        DJ:
        <select value={dj} onChange={(e) => setDj(e.target.value)}>
          <option value="">Select...</option>
          <option value="Danny Garcia">Danny Garcia</option>
          <option value="Tomas Duque">Tomas Duque</option>
          <option value="Lucas Maldonado">Lucas Maldonado</option>
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default DjPromoForm;
