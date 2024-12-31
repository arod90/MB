'use client';
import React, { useState } from 'react';
import { useClientContext } from '@/context/ClientContext';
import {
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from 'recharts';
import MixConsumoPieChart from '../../components/MixConsumoPieChart/MixConsumoPieChart';
import AgePieChart from '../../components/AgePieChart/AgePieChart';
import ProductsChart from '@/components/ProductsChart/ProductsChart';

const MetricCard = ({ title, children, className = '' }) => (
  <div
    className={`bg-white rounded-lg shadow-lg p-4 lg:p-6 ${className} border border-gray-300`}
  >
    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h3>
    <div className="h-[calc(100%-2rem)] overflow-auto">{children}</div>
  </div>
);

const CustomerList = ({ title, count, customers }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs lg:text-sm text-gray-600 font-medium">
        {title}
      </span>
      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
        {count}
      </span>
    </div>
    <div className="overflow-y-auto max-h-[150px] lg:max-h-[200px]">
      <table className="w-full">
        <tbody>
          {customers.map((customer, index) => {
            // Determine status color based on visits
            let statusColor;
            if (customer.visits > 10) {
              statusColor = 'bg-yellow-400'; // VIP
            } else if (customer.visits >= 3) {
              statusColor = 'bg-green-400'; // Regular
            } else {
              statusColor = 'bg-gray-200'; // New
            }

            return (
              <tr key={index} className="border-b hover:bg-gray-50 relative">
                <td className="py-1.5 text-xs lg:text-sm pl-2 flex items-center">
                  <div
                    className={`w-1 h-full absolute left-0 ${statusColor}`}
                    style={{ top: 0 }}
                  />
                  <span className="ml-2">{customer.name}</span>
                </td>
                <td className="py-1.5 text-xs lg:text-sm text-right pr-2">
                  {customer.visits} visitas
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardLayout = () => {
  const { clients } = useClientContext();

  // At the top of DashboardLayout.jsx, add these constants:
  const EXCLUDED_KEYWORDS = [
    'AP. MUSICAL',
    'MUSICAL',
    'AP MUSICAL',
    'HOMBRES',
    'MUJERES',
  ];

  const BEBIDA_KEYWORDS = [
    // Alcoholic Beverages
    'BOT',
    'SHOT',
    'SINGLE',
    'CERVEZA',
    'MARTINI',
    'NEGRONI',
    'MULE',
    'MOJITO',
    'MARGARITA',
    'CASILLERO DEL DIABLO',
    'COPA',
    'BLEND',
    'WHISKY',
    'VODKA',
    'GIN',
    'TEQUILA',
    'RON',
    'JAGER',
    'ANTIOQUEÑO',
    'BUCHANANS',
    'CHIVAS',
    'JACK',
    'JOHNNIE',
    'OLD PARR',
    'FLOR DE CAÑA',
    'ABUELO',
    'BALLANTINE',
    'JOSE CUERVO',
    'CORRALEJO',
    'DRAFT',
    'STELLA',
    'CORONA',
    'CLUB',
    'BEER',
    'VINO',
    'COPA',
    'WINE',
    'CALVET',
    'SPRITZ',
    'FERNET',
    // Non-alcoholic beverages
    'RED BULL',
    'AGUA',
    'COCA COLA',
    'SPRITE',
    'TONIC',
    'GINGER BEER',
    'ZERO',
    'TWIST',
    // Cocktails and Mixed Drinks
    'CARAJILLO',
    'COLLINS',
    'SOUR',
    'PALOMA',
    'BLOODY MARY',
    'MANHATTAN',
    'OLD FASHIONED',
    'PORNSTAR',
    // 'BOURBON',
    'COSMOPOLITAN',
    'ESPRESSO',
  ];

  const ALIMENTO_KEYWORDS = [
    'TOAST',
    'TARTAR',
    'CHIPS',
    'PAPAS',
    'FRITAS',
    'LOMO',
    'PORK',
    'BELLY',
    'FISH',
    'TUNA',
    'PULPO',
    'LANGOSTINO',
    'CAMARÓN',
    'ANDEAN',
    'BEEF',
    'TRUFFLE',
    'BROWNIE',
    'DIP',
    'ALCACHOFA',
    'HAMBURGUESA',
    'TACOS',
    'DEEP FRIED',
    'KYMONO',
  ];

  // Add this helper function before calculateMetrics
  const categorizeProduct = (product) => {
    const upperProduct = product.toUpperCase();

    if (BEBIDA_KEYWORDS.some((keyword) => upperProduct.includes(keyword))) {
      return 'bebidas';
    }

    if (ALIMENTO_KEYWORDS.some((keyword) => upperProduct.includes(keyword))) {
      return 'comidas';
    }

    console.log('Uncategorized product:', product);
    return 'otros';
  };

  const calculateMetrics = () => {
    if (!clients?.length) return null;
    const metrics = {
      totalRevenue: 0,
      productSales: {},
      customerTypes: {
        nuevo: { count: 0, clients: [] },
        regular: { count: 0, clients: [] },
        vip: { count: 0, clients: [] },
      },
      demographics: { age: {} },
      topSpenders: [],
      productMix: {
        bebidas: { count: 0, revenue: 0 },
        comidas: { count: 0, revenue: 0 },
      },
      revenueByDate: {},
      ticketsByDate: {},
      topAlimento: null,
      topBebida: null,
    };

    clients.forEach((client) => {
      if (!client?.Consumos_general) return;
      const clientInfo = {
        name: `${client.Nombre} ${client.Apellido}`,
        visits: client.NumIngresos,
        lastVisit:
          client.Ingresos?.length > 0
            ? client.Ingresos[client.Ingresos.length - 1].Fecha
            : null,
      };

      // Customer Classification
      if (client.NumIngresos <= 2) {
        metrics.customerTypes.nuevo.count++;
        metrics.customerTypes.nuevo.clients.push(clientInfo);
      } else if (client.NumIngresos <= 10) {
        metrics.customerTypes.regular.count++;
        metrics.customerTypes.regular.clients.push(clientInfo);
      } else {
        metrics.customerTypes.vip.count++;
        metrics.customerTypes.vip.clients.push(clientInfo);
      }

      // Demographics
      const age = client.Edad;
      const ageGroup =
        age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : '45+';
      metrics.demographics.age[ageGroup] =
        (metrics.demographics.age[ageGroup] || 0) + 1;

      // Process consumption data
      client.Consumos_general.forEach((consumo) => {
        if (!consumo?.Monto) return;
        const amount = parseFloat(consumo.Monto);
        if (isNaN(amount)) return;

        metrics.totalRevenue += amount;

        // Track daily revenue and tickets
        const date = new Date(consumo.Fecha).toISOString().split('T')[0];
        metrics.revenueByDate[date] =
          (metrics.revenueByDate[date] || 0) + amount;
        metrics.ticketsByDate[date] = (metrics.ticketsByDate[date] || 0) + 1;

        // Calculate total items in this consumption
        const totalItems =
          consumo.Detalles?.reduce((total, detalle) => {
            const cantidad = parseInt(detalle.Cantidad);
            return total + (isNaN(cantidad) ? 0 : cantidad);
          }, 0) || 1;

        // Calculate revenue per item for this consumption
        const revenuePerItem = amount / totalItems;

        // Process each item in the consumption
        consumo.Detalles?.forEach((detalle) => {
          if (!detalle?.Producto || !detalle?.Cantidad) return;
          const producto = detalle.Producto.trim();
          const cantidad = parseInt(detalle.Cantidad);
          if (isNaN(cantidad)) return;

          // Track product sales (including cover charges)
          metrics.productSales[producto] =
            (metrics.productSales[producto] || 0) + cantidad;

          // Skip excluded products
          if (
            EXCLUDED_KEYWORDS.some((keyword) =>
              producto.toUpperCase().includes(keyword)
            )
          ) {
            return;
          }

          // Track product sales
          metrics.productSales[producto] =
            (metrics.productSales[producto] || 0) + cantidad;

          // Calculate revenue for this item
          const itemRevenue = revenuePerItem * cantidad;

          // Use the new categorization
          const category = categorizeProduct(producto);
          if (category === 'bebidas') {
            metrics.productMix.bebidas.count += cantidad;
            metrics.productMix.bebidas.revenue += itemRevenue;
          } else if (category === 'comidas') {
            metrics.productMix.comidas.count += cantidad;
            metrics.productMix.comidas.revenue += itemRevenue;
          }
        });
      });

      // Calculate total spent for top spenders
      const totalSpent = client.Consumos_general.reduce((sum, consumo) => {
        const amount = parseFloat(consumo?.Monto || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      if (totalSpent > 0) {
        metrics.topSpenders.push({
          name: clientInfo.name,
          total: totalSpent,
          visits: client.NumIngresos,
          lastVisit: clientInfo.lastVisit,
        });
      }
    });

    // Determine Top Alimento and Top Bebida

    const determineProductCategory = (product) => {
      const upperProduct = product.toUpperCase();

      if (BEBIDA_KEYWORDS.some((keyword) => upperProduct.includes(keyword))) {
        return 'bebidas';
      }

      if (ALIMENTO_KEYWORDS.some((keyword) => upperProduct.includes(keyword))) {
        return 'comidas';
      }

      console.log('Uncategorized product:', product);
      return 'otros';
    };

    metrics.topAlimento = { name: '', count: 0 };
    metrics.topBebida = { name: '', count: 0 };

    Object.entries(metrics.productSales).forEach(([product, count]) => {
      const category = determineProductCategory(product);

      if (category === 'bebidas') {
        if (count > metrics.topBebida.count) {
          metrics.topBebida = { name: product, count };
        }
      } else if (category === 'comidas') {
        if (count > metrics.topAlimento.count) {
          metrics.topAlimento = { name: product, count };
        }
      }
    });

    metrics.topAlimento = metrics.topAlimento.name
      ? metrics.topAlimento
      : { name: 'N/A', count: 0 };
    metrics.topBebida = metrics.topBebida.name
      ? metrics.topBebida
      : { name: 'N/A', count: 0 };

    // Sort customer lists
    Object.values(metrics.customerTypes).forEach((type) => {
      type.clients.sort((a, b) => b.visits - a.visits);
    });

    // Sort top spenders
    metrics.topSpenders.sort((a, b) => b.total - a.total);
    metrics.topSpenders = metrics.topSpenders.slice(0, 14);

    // Calculate revenue timeline
    metrics.revenueTimeline = Object.entries(metrics.revenueByDate)
      .map(([date, revenue]) => ({
        date,
        revenue,
        tickets: metrics.ticketsByDate[date],
        avgTicket: revenue / metrics.ticketsByDate[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('Calculated metrics:', metrics);
    return metrics;
  };

  const metrics = calculateMetrics();
  if (!metrics) return null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 p-2 lg:p-6 bg-bgGray">
      {/* Key Metrics with Customer Lists */}
      <div className="md:col-span-2 xl:col-span-5 h-[400px] lg:h-[450px]">
        <MetricCard title="Métricas Clave" className="h-full ">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b">
              <div className="mb-4 lg:mb-0">
                <p className="text-xs lg:text-sm text-gray-600">
                  Ingresos totales de clientes
                </p>
                <p className="text-xl lg:text-2xl font-bold">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">VIP</p>
                  <p className="font-bold">{metrics.customerTypes.vip.count}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Regulares</p>
                  <p className="font-bold">
                    {metrics.customerTypes.regular.count}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Nuevos</p>
                  <p className="font-bold">
                    {metrics.customerTypes.nuevo.count}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6 overflow-y-auto">
              <CustomerList
                title="Clientes VIP"
                count={metrics.customerTypes.vip.count}
                customers={metrics.customerTypes.vip.clients}
              />
              <CustomerList
                title="Clientes Regulares"
                count={metrics.customerTypes.regular.count}
                customers={metrics.customerTypes.regular.clients}
              />
              <CustomerList
                title="Clientes Nuevos"
                count={metrics.customerTypes.nuevo.count}
                customers={metrics.customerTypes.nuevo.clients}
              />
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Age Demographics */}
      <div className="md:col-span-1 xl:col-span-3 h-[450px] lg:h-[450px]">
        <AgePieChart />
      </div>

      {/* Product Mix */}
      <div className="md:col-span-1 xl:col-span-4 h-[450px] lg:h-[450px]">
        <MixConsumoPieChart metrics={metrics} />
      </div>

      {/* Products Chart */}
      <div className="md:col-span-2 xl:col-span-6 lg:h-[600px]">
        <ProductsChart productSales={metrics.productSales} />
      </div>
      {/* Top Spenders */}
      <div className="md:col-span-2 xl:col-span-6 h-[400px] lg:h-[600px]">
        <MetricCard title="Mejores Clientes" className="h-full">
          <div className="h-full overflow-auto relative">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-white z-20">
                <tr className="border-b after:absolute after:left-0 after:right-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gray-200">
                  <th className="text-left py-2 text-xs lg:text-sm bg-white">
                    Cliente
                  </th>
                  <th className="text-right py-2 text-xs lg:text-sm bg-white">
                    Total Gastado
                  </th>
                  <th className="text-right py-2 text-xs lg:text-sm bg-white">
                    Visitas
                  </th>
                  <th className="text-right py-2 text-xs lg:text-sm bg-white">
                    Última Visita
                  </th>
                </tr>
              </thead>
              <tbody className="relative">
                {metrics.topSpenders.map((spender, index) => {
                  let statusColor;
                  if (spender.visits > 10) {
                    statusColor = 'bg-yellow-400';
                  } else if (spender.visits >= 3) {
                    statusColor = 'bg-green-400';
                  } else {
                    statusColor = 'bg-gray-200';
                  }

                  return (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 relative"
                    >
                      <td className="py-2 text-xs lg:text-sm relative">
                        <div
                          className={`absolute left-0 top-0 ${statusColor} w-1 h-full`}
                        />
                        <span className="pl-3">{spender.name}</span>
                      </td>
                      <td className="text-right text-xs lg:text-sm pr-4">
                        {formatCurrency(spender.total)}
                      </td>
                      <td className="text-right text-xs lg:text-sm pr-4">
                        {spender.visits}
                      </td>
                      <td className="text-right text-xs lg:text-sm pr-4">
                        {new Date(spender.lastVisit).toLocaleDateString(
                          'es-ES',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </MetricCard>
      </div>

      {/* Revenue Trends Graph */}
      <div className="md:col-span-2 xl:col-span-12 h-[300px] lg:h-[400px]">
        <MetricCard title="Tendencias de Consumo" className="h-full">
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer>
              <LineChart
                data={metrics.revenueTimeline}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  fontSize={11}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                    })
                  }
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#8884d8"
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  fontSize={11}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  fontSize={11}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`,
                    name === 'revenue'
                      ? 'Ingresos'
                      : name === 'avgTicket'
                      ? 'Ticket Promedio'
                      : 'Transacciones',
                  ]}
                  labelFormatter={(date) =>
                    new Date(date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  }
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend
                  formatter={(value) =>
                    value === 'revenue'
                      ? 'Ingresos'
                      : value === 'avgTicket'
                      ? 'Ticket Promedio'
                      : 'Transacciones'
                  }
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  yAxisId="left"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avgTicket"
                  stroke="#82ca9d"
                  yAxisId="right"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
      </div>
    </div>
  );
};

export default DashboardLayout;
