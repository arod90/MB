'use client';
import React, { useEffect, useMemo } from 'react';
import ClientCard from '@/components/ClientCard/ClientCard';
import { useClientContext } from '@/context/ClientContext';
import useClientData from '@/hooks/useClientData';

const Clientes = () => {
  const { clients } = useClientContext();
  const { refetch } = useClientData();

  useEffect(() => {
    // Initial fetch
    refetch();

    // Set up an interval to periodically refetch data
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // Refetch every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch]);

  // Sort clients by the most recent ingreso date
  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      const lastIngresoA = new Date(a.Ingresos[a.Ingresos.length - 1]?.Fecha);
      const lastIngresoB = new Date(b.Ingresos[b.Ingresos.length - 1]?.Fecha);
      return lastIngresoB - lastIngresoA;
    });
  }, [clients]);

  return (
    <section>
      <h1 className="text-xl ml-3 font-semibold">
        {new Date().toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </h1>
      <div className="client-list">
        {sortedClients.map((client) => (
          <ClientCard key={client.Id} client={client} />
        ))}
      </div>
    </section>
  );
};

export default Clientes;
