'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useClientData from '@/hooks/useClientData';
import { useClientContext } from '@/context/ClientContext';

export default function NotificationHandler() {
  const [polling, setPolling] = useState(true);
  const { fetchSingleClient, refetch } = useClientData();
  const { addOrUpdateClient } = useClientContext();

  useEffect(() => {
    const pollSQS = async () => {
      if (!polling) return;

      try {
        const response = await fetch('/api/pollSQS');
        const data = await response.json();

        if (data.notification) {
          toast.success(`Nuevo ingreso detectado: ${data.notification.s3_url}`);

          // Fetch updated client data
          const updatedClientData = await fetchSingleClient(
            data.notification.image_id
          );

          // Update the client context
          if (updatedClientData) {
            addOrUpdateClient(updatedClientData);
          }

          // Trigger a full refresh of all clients
          refetch();
        }
      } catch (error) {
        console.error('Error polling SQS:', error);
      }

      setTimeout(pollSQS, 5000);
    };

    pollSQS();

    return () => setPolling(false);
  }, [polling, fetchSingleClient, addOrUpdateClient, refetch]);

  return null;
}
