import { useState, useEffect, useCallback } from 'react';
import { useClientContext } from '../context/ClientContext';

const useClientData = () => {
  const { clients, updateClients, addOrUpdateClient } = useClientContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://ebj84usrbb.execute-api.us-east-1.amazonaws.com/api/usuario'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }
      const data = await response.json();
      updateClients(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [updateClients]);

  const fetchSingleClient = useCallback(
    async (clientId) => {
      try {
        const response = await fetch(
          `https://ebj84usrbb.execute-api.us-east-1.amazonaws.com/api/usuario/${clientId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch single client data');
        }
        const data = await response.json();
        addOrUpdateClient(data.data);
        return data.data;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [addOrUpdateClient]
  );

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients, fetchSingleClient };
};

export default useClientData;
