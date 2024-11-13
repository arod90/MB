'use client';
import React, { useMemo } from 'react';
import { useClientContext } from '@/context/ClientContext';

const CustomerStaffMatching = () => {
  const { clients } = useClientContext();

  const customerAnalytics = useMemo(() => {
    if (!clients || clients.length === 0) return [];

    const vipThreshold = 10;
    const regularThreshold = 3;

    return clients
      .map((client) => {
        const staffPerformance = {};
        let totalSpent = 0;
        let totalTransactions = 0;
        const allPurchases = {};

        client.Consumos_general?.forEach((consumo) => {
          if (!consumo.Vendedor) return;
          const amount = parseFloat(consumo.Monto || 0);
          if (amount > 0) {
            totalSpent += amount;
            totalTransactions += 1;
          }

          if (!staffPerformance[consumo.Vendedor]) {
            staffPerformance[consumo.Vendedor] = {
              totalSales: 0,
              transactions: 0,
              averageTicket: 0,
            };
          }

          staffPerformance[consumo.Vendedor].totalSales += amount;
          staffPerformance[consumo.Vendedor].transactions += 1;

          consumo.Detalles?.forEach((d) => {
            if (!d.Producto || !d.Cantidad) return;
            if (!allPurchases[d.Producto]) {
              allPurchases[d.Producto] = 0;
            }
            allPurchases[d.Producto] += parseFloat(d.Cantidad);
          });
        });

        const topStaff = Object.entries(staffPerformance)
          .map(([name, perf]) => ({
            name,
            ...perf,
            averageTicket:
              perf.transactions > 0 ? perf.totalSales / perf.transactions : 0,
          }))
          .sort((a, b) => b.averageTicket - a.averageTicket)
          .slice(0, 3);

        const sortedProducts = Object.entries(allPurchases)
          .map(([product, quantity]) => ({ product, quantity }))
          .sort((a, b) => b.quantity - a.quantity);

        // Determine customer status
        let status = 'Ocasional';
        if (client.NumIngresos >= vipThreshold) {
          status = 'VIP';
        } else if (client.NumIngresos >= regularThreshold) {
          status = 'Regular';
        }

        return {
          id: client.Id,
          name: `${client.Nombre} ${client.Apellido}`,
          status,
          visits: client.NumIngresos,
          totalSpent,
          averageTicket:
            totalTransactions > 0 ? totalSpent / totalTransactions : 0,
          topStaff,
          purchaseHistory: sortedProducts,
        };
      })
      .sort((a, b) => {
        // Sort first by status (VIP > Regular > Ocasional)
        const statusOrder = { VIP: 0, Regular: 1, Ocasional: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        // Within same status, sort by total spent
        return b.totalSpent - a.totalSpent;
      });
  }, [clients]);

  if (!clients || clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          Cargando datos de clientes...
        </div>
      </div>
    );
  }

  // Group customers by status for display
  const groupedCustomers = {
    VIP: customerAnalytics.filter((c) => c.status === 'VIP'),
    Regular: customerAnalytics.filter((c) => c.status === 'Regular'),
    Ocasional: customerAnalytics.filter((c) => c.status === 'Ocasional'),
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">
          Asignación Recomendada de Personal
        </h2>
        <div className="space-y-8 max-h-[800px] overflow-y-auto">
          {Object.entries(groupedCustomers).map(([status, customers]) => (
            <div key={status} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 sticky top-0 bg-white py-2">
                Clientes {status} ({customers.length})
              </h3>
              <div className="grid gap-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`border rounded-lg p-4 h-[250px] ${
                      customer.status === 'VIP'
                        ? 'border-yellow-400 bg-yellow-50'
                        : customer.status === 'Regular'
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 h-full">
                      <div className="flex-1 flex flex-col h-full">
                        {/* Fixed height for customer info */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="text-md font-semibold">
                              {customer.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                customer.status === 'VIP'
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : customer.status === 'Regular'
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              {customer.status}
                            </span>
                          </div>
                          <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                            <div>Visitas totales: {customer.visits}</div>
                            <div>
                              Total consumido:{' '}
                              {new Intl.NumberFormat('es-EC', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(customer.totalSpent)}
                            </div>
                            <div>
                              Promedio por consumo:{' '}
                              {new Intl.NumberFormat('es-EC', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(customer.averageTicket)}
                            </div>
                          </div>
                        </div>

                        {/* Scrollable purchase history taking remaining height */}
                        {customer.purchaseHistory.length > 0 && (
                          <div className="flex-1 bg-white rounded-lg p-3 shadow-sm overflow-hidden">
                            <div className="font-medium text-sm text-gray-700 mb-2">
                              Historial de Productos
                            </div>
                            <div className="overflow-y-auto h-[calc(100%-2rem)]">
                              {customer.purchaseHistory.map((item, idx) => (
                                <div key={idx} className="text-xs py-0.5">
                                  • {item.quantity}x {item.product}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Staff Recommendations with fixed height and scrollable content */}
                      {customer.topStaff.length > 0 && (
                        <div className="flex-1 h-full">
                          <div className="bg-white rounded-lg p-3 shadow-sm h-full flex flex-col">
                            <h4 className="text-sm font-semibold text-green-700 mb-2">
                              Personal Recomendado
                            </h4>
                            <div className="overflow-y-auto flex-1">
                              {customer.topStaff.map((staff, index) => (
                                <div key={staff.name} className="mb-3">
                                  <div className="font-medium text-sm">
                                    <span className="text-gray-500">
                                      {index + 1}.{' '}
                                    </span>
                                    {staff.name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    <div>
                                      Promedio por transacción:{' '}
                                      {new Intl.NumberFormat('es-EC', {
                                        style: 'currency',
                                        currency: 'USD',
                                      }).format(staff.averageTicket)}
                                    </div>
                                    <div>
                                      Transacciones exitosas:{' '}
                                      {staff.transactions}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerStaffMatching;
