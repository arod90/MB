import React, { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BusinessInsights = () => {
  const [customerData, setCustomerData] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Fetch data from your API endpoints
    const fetchData = async () => {
      try {
        const reportResponse = await fetch(
          'https://ebj84usrbb.execute-api.us-east-1.amazonaws.com/api/noche/report'
        );
        const reportJson = await reportResponse.json();
        setReportData(reportJson.data);

        const customerResponse = await fetch(
          'https://ebj84usrbb.execute-api.us-east-1.amazonaws.com/api/usuario'
        );
        const customerJson = await customerResponse.json();
        setCustomerData(customerJson.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!reportData || !customerData) {
    return <div className="p-4">Loading...</div>;
  }

  // Process consumption data
  const consumptionData = Object.entries(reportData.Consumos)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      value,
    }));

  // Process age distribution
  const ageData = Object.entries(reportData.Edad).map(([range, value]) => ({
    range,
    value,
  }));

  // Calculate customer metrics
  const totalCustomers = customerData.length;
  const repeatCustomers = customerData.filter(
    (customer) => customer.NumIngresos > 1
  ).length;
  const vipCustomers = customerData.filter(
    (customer) => customer.NumIngresos > 10
  ).length;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Key Metrics */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Key Performance Metrics</h3>
        </div>
        <div className="p-6 flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold">
              ${reportData.Facturacion.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="text-sm text-gray-500">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{vipCustomers}</div>
            <div className="text-sm text-gray-500">VIP Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{repeatCustomers}</div>
            <div className="text-sm text-gray-500">Repeat Customers</div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Top Products</h3>
        </div>
        <div className="p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumptionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Age Distribution</h3>
        </div>
        <div className="p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {ageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
