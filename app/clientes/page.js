'use client';
import React from 'react';
import clientList from '../../mocks/clientes.json';
import ClientCard from '@/components/ClientCard/ClientCard';
import { PiIdentificationCardDuotone } from 'react-icons/pi';

const clientes = () => {
  return (
    <section>
      <div className="scan-button-cont">
        <button>
          <PiIdentificationCardDuotone />
          <span>Escanear Cedula</span>
        </button>
      </div>
      <div className="client-list">
        {clientList.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </section>
  );
};

export default clientes;
