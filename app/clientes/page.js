'use client';
import React, { useEffect, useMemo, useState } from 'react';
import ClientCard from '@/components/ClientCard/ClientCard';
import { useClientContext } from '@/context/ClientContext';
import useClientData from '@/hooks/useClientData';
import LoadingSpinner from '@/components/LoadingSpinner';

const Clientes = () => {
  const { clients } = useClientContext();
  const { refetch, loading } = useClientData();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      await refetch();
      setInitialLoadComplete(true);
    };

    fetchInitialData();

    const intervalId = setInterval(refetch, 5000); // Refetch every 5 seconds

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

  if (!initialLoadComplete) {
    return <LoadingSpinner />;
  }

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
