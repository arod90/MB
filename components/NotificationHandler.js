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
          const { image_id, s3_url } = data.notification;

          // Store the URL in localStorage with the ingreso ID as key
          localStorage.setItem(`image_url_${image_id}`, s3_url);

          toast.success('Nuevo ingreso detectado');

          // Fetch updated client data
          const updatedClientData = await fetchSingleClient(image_id);

          if (updatedClientData) {
            // Store the URL with the latest ingreso
            if (
              updatedClientData.Ingresos &&
              updatedClientData.Ingresos.length > 0
            ) {
              const latestIngreso =
                updatedClientData.Ingresos[
                  updatedClientData.Ingresos.length - 1
                ];
              latestIngreso.imageUrl = s3_url; // Add the URL to the ingreso object
            }

            addOrUpdateClient(updatedClientData);
          }

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
