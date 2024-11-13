'use client';
import React from 'react';
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
} from 'recharts';

const MetricCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 h-[400px] flex flex-col">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="flex-1 overflow-auto">{children}</div>
  </div>
);

const CustomerList = ({ title, count, customers }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2 text-sm">
      <span className="text-gray-600 font-medium">{title}</span>
      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
        {count}
      </span>
    </div>
    <div className="overflow-y-auto">
      <table className="w-full">
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-1.5 text-sm pl-2">{customer.name}</td>
              <td className="py-1.5 text-sm text-right pr-2">
                {customer.visits} visitas
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardLayout = () => {
  const { clients } = useClientContext();
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#9C27B0',
    '#FF5722',
  ];

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
      demographics: {
        age: {},
      },
      topSpenders: [],
      productMix: {
        bebidas: { count: 0, revenue: 0 },
        comidas: { count: 0, revenue: 0 },
      },
      revenueByDate: {},
      ticketsByDate: {},
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
        // Handle missing or invalid Monto
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

          const producto = detalle.Producto;
          const cantidad = parseInt(detalle.Cantidad);
          if (isNaN(cantidad)) return;

          // Track product sales
          metrics.productSales[producto] =
            (metrics.productSales[producto] || 0) + cantidad;

          // Calculate revenue for this item
          const itemRevenue = revenuePerItem * cantidad;

          // Categorize products and add revenue
          if (
            producto.includes('BOT') ||
            producto.includes('CERVEZA') ||
            producto.includes('MARTINI') ||
            producto.includes('NEGRONI') ||
            producto.includes('SHOT') ||
            producto.includes('SINGLE') ||
            producto.includes('MULE') ||
            producto.includes('MOJITO') ||
            producto.includes('MARGARITA')
          ) {
            metrics.productMix.bebidas.count += cantidad;
            metrics.productMix.bebidas.revenue += itemRevenue;
          } else {
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

    // Sort customer lists
    Object.values(metrics.customerTypes).forEach((type) => {
      type.clients.sort((a, b) => b.visits - a.visits);
    });

    // Sort top spenders
    metrics.topSpenders.sort((a, b) => b.total - a.total);
    metrics.topSpenders = metrics.topSpenders.slice(0, 10);

    // Calculate revenue timeline
    metrics.revenueTimeline = Object.entries(metrics.revenueByDate)
      .map(([date, revenue]) => ({
        date,
        revenue,
        tickets: metrics.ticketsByDate[date],
        avgTicket: revenue / metrics.ticketsByDate[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Verify totals
    console.log('Revenue Verification:', {
      totalRevenue: metrics.totalRevenue.toFixed(2),
      bebidasRevenue: metrics.productMix.bebidas.revenue.toFixed(2),
      comidasRevenue: metrics.productMix.comidas.revenue.toFixed(2),
      sumOfCategories: (
        metrics.productMix.bebidas.revenue + metrics.productMix.comidas.revenue
      ).toFixed(2),
      difference: (
        metrics.totalRevenue -
        (metrics.productMix.bebidas.revenue +
          metrics.productMix.comidas.revenue)
      ).toFixed(2),
    });

    return metrics;
  };

  const metrics = calculateMetrics();
  if (!metrics) return <div></div>;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Key Metrics with Customer Lists */}
      <div className="col-span-12 lg:col-span-5">
        <MetricCard title="Métricas Clave">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <p className="text-gray-600">Ingresos totales de clientes</p>
                <p className="text-2xl font-bold">
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

            <div className="space-y-6">
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
      {/* TODO! invertir leyenda */}
      <div className="col-span-12 lg:col-span-3">
        <MetricCard title="Edad de los Clientes">
          <PieChart width={280} height={280}>
            <Pie
              data={Object.entries(metrics.demographics.age).map(
                ([name, value]) => ({
                  name: value.toString(), // Show the count in the chart
                  value: value,
                  ageRange: name, // Keep age range for legend
                })
              )}
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ name }) => name} // Display count in the chart
            >
              {Object.entries(metrics.demographics.age).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value, entry) => entry.payload.ageRange} />
          </PieChart>
        </MetricCard>
      </div>

      {/* Product Mix */}
      <div className="col-span-12 lg:col-span-4">
        <MetricCard title="Mix de Consumo">
          <PieChart width={300} height={300}>
            <Pie
              data={Object.entries(metrics.productMix).map(
                ([name, { revenue }]) => ({
                  name: name === 'bebidas' ? 'Bebidas' : 'Alimentos',
                  value: revenue,
                })
              )}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ value }) => formatCurrency(value)}
            >
              {Object.entries(metrics.productMix).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </MetricCard>
      </div>

      {/* Products Chart */}
      <div className="col-span-12 lg:col-span-6">
        <MetricCard title="Productos más Vendidos">
          <div className="h-full overflow-y-auto">
            <div className="w-full flex justify-start">
              <BarChart
                width={500}
                height={800}
                data={Object.entries(metrics.productSales)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 20)
                  .map(([name, value]) => ({
                    name:
                      name.length > 25 ? name.substring(0, 25) + '...' : name,
                    value,
                  }))}
                layout="vertical"
                margin={{ top: 5, right: 45, left: 120, bottom: 5 }}
              >
                <XAxis type="number" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  interval={0}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: '12px' }}
                  labelStyle={{ fontSize: '11px' }}
                />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  label={(props) => (
                    <text
                      x={props.x + props.width + 5}
                      y={props.y + props.height / 2}
                      fill="#666"
                      fontSize={11}
                      textAnchor="start"
                      dy={4}
                    >
                      {props.value}
                    </text>
                  )}
                />
              </BarChart>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Top Spenders */}
      <div className="col-span-12 lg:col-span-6">
        <MetricCard title="Mejores Clientes">
          <div className="overflow-y-auto px-4">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left py-2">Cliente</th>
                  <th className="text-right py-2">Total Gastado</th>
                  <th className="text-right py-2">Visitas</th>
                  <th className="text-right py-2">Última Visita</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topSpenders.map((spender, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">{spender.name}</td>
                    <td className="text-right">
                      {formatCurrency(spender.total)}
                    </td>
                    <td className="text-right">{spender.visits}</td>
                    <td className="text-right">
                      {new Date(spender.lastVisit).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MetricCard>
      </div>

      {/* Revenue Trends Graph */}
      <div className="col-span-12">
        <MetricCard title="Tendencias de Consumo">
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <LineChart
                width={1100}
                height={300}
                data={metrics.revenueTimeline}
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
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
                />
                <Legend
                  formatter={(value) =>
                    value === 'revenue'
                      ? 'Ingresos'
                      : value === 'avgTicket'
                      ? 'Ticket Promedio'
                      : 'Transacciones'
                  }
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
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Comparativa de ingresos y ticket promedio por día
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
};

export default DashboardLayout;
