'use client';
import React, { createContext, useState, useContext, useCallback } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  const updateClients = useCallback((newClients) => {
    setClients(newClients);
  }, []);

  const addOrUpdateClient = useCallback((newClient) => {
    setClients((prevClients) => {
      const index = prevClients.findIndex(
        (client) => client.Id === newClient.Id
      );
      if (index !== -1) {
        // Update existing client
        const updatedClients = [...prevClients];
        updatedClients[index] = newClient;
        return updatedClients;
      } else {
        // Add new client
        return [newClient, ...prevClients];
      }
    });
  }, []);

  return (
    <ClientContext.Provider
      value={{ clients, updateClients, addOrUpdateClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => useContext(ClientContext);
