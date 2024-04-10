'use client';
import React from 'react';
import clientList from '../../mocks/clientes.json';
import ClientCard from '@/components/ClientCard/ClientCard';
import CameraButton from '@/components/CameraButton/CameraButton';

const clientes = () => {
  return (
    <section>
      <div className="scan-button-cont">
        <CameraButton />
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
