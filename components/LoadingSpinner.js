import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          Cargando información de clientes...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
