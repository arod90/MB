'use client';
import React from 'react';
import clientList from '../../mocks/clientes.json';
import ClientCard from '@/components/ClientCard/ClientCard';
import CameraButton from '@/components/CameraButton/CameraButton';

const clientes = () => {
  return (
    <section>
      {/* <div className="scan-button-cont">
        <CameraButton />
      </div> */}
      <h1 className="text-xl ml-3 font-semibold">
        {new Date().toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </h1>
      <div className="client-list mt-10">
        {clientList.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </section>
  );
};

export default clientes;
