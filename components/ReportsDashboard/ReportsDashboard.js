import React, { useState, useEffect, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useWindowSize from '@/hooks/useWindowSize';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#9C27B0',
  '#FF5722',
];

const MetricCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-2 h-full flex flex-col border border-gray-300">
    <h3 className="text-lg font-semibold text-gray-800 mb-2 px-2">{title}</h3>
    <div className="flex-1 overflow-hidden">{children}</div>
  </div>
);

const ReportsDashboard = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const pickerRef = useRef(null);
  const size = useWindowSize();

  const fetchReportData = async (startDate, endDate) => {
    try {
      const formattedStartDate = format(startDate, 'dd-MM-yyyy');
      const formattedEndDate = format(endDate, 'dd-MM-yyyy');
      const url = `${process.env.NEXT_PUBLIC_AWS_URL}noche/report?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      const response = await fetch(url);
      const data = await response.json();
      setReportData(data.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  useEffect(() => {
    fetchReportData(state[0].startDate, state[0].endDate);
  }, [state]);

  const handleSelect = (ranges) => {
    setState([ranges.selection]);
  };

  const togglePicker = () => setIsVisible(!isVisible);

  const monthsToShow = size.width <= 768 ? 1 : 2;

  const formatDates = () => {
    const { startDate, endDate } = state[0];
    const start = format(startDate, 'dd-MM-yyyy');
    return start === format(endDate, 'dd-MM-yyyy')
      ? start
      : `${start} - ${format(endDate, 'dd-MM-yyyy')}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!reportData) return <div>Loading...</div>;

  // Prepare data
  const genderData = Object.entries(reportData.Genero).map(([key, value]) => ({
    name: key === 'm' ? 'Masculino' : 'Femenino',
    value,
  }));

  const ageData = Object.entries(reportData.Edad).map(([range, value]) => ({
    name: range,
    value,
  }));

  const civilStatusData = Object.entries(reportData.EstadoCivil).map(
    ([status, value]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value,
    })
  );

  const consumptionData = Object.entries(reportData.Consumos)
    .map(([item, quantity]) => ({
      name: item.length > 20 ? item.substring(0, 20) + '...' : item,
      fullName: item,
      value: quantity,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          fontSize={10}
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom tick for consumption chart
  const CustomConsumptionTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-5}
          y={0}
          textAnchor="end"
          fill="#666"
          fontSize={9}
          dominantBaseline="middle"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="p-4">
      {/* Date Picker Section */}
      <div className="mb-4 relative">
        <button
          className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={togglePicker}
        >
          Select Dates
        </button>
        <span className="ml-3 text-sm text-gray-700">{formatDates()}</span>
        {isVisible && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <div
              ref={pickerRef}
              className="absolute mt-2 z-50 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <DateRangePicker
                onChange={handleSelect}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={monthsToShow}
                ranges={state}
                direction="horizontal"
                locale={es}
                inputRanges={[]}
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Key Metrics */}
        <div className="col-span-12 lg:col-span-4 h-[300px]">
          <MetricCard title="Métricas Clave">
            <div className="space-y-4 p-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Número de noches visualizadas</p>
                <p className="text-3xl font-bold">{reportData.NumNoches}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Total Facturación</p>
                <p className="text-3xl font-bold">
                  ${reportData.Facturacion.toFixed(2)}
                </p>
              </div>
            </div>
          </MetricCard>
        </div>

        {/* Gender Distribution */}
        <div className="col-span-12 lg:col-span-4 h-[300px]">
          <MetricCard title="Distribución por Género">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={20} />
              </PieChart>
            </ResponsiveContainer>
          </MetricCard>
        </div>

        {/* Age Distribution */}
        <div className="col-span-12 lg:col-span-4 h-[300px]">
          <MetricCard title="Distribución por Edad">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={ageData}
                margin={{ top: 5, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  height={60}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {ageData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MetricCard>
        </div>

        {/* Civil Status */}
        <div className="col-span-12 lg:col-span-6 h-[350px]">
          <MetricCard title="Distribución por Estado Civil">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={civilStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {civilStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={20} />
              </PieChart>
            </ResponsiveContainer>
          </MetricCard>
        </div>

        {/* Top Consumptions */}
        <div className="col-span-12 lg:col-span-6 h-[350px]">
          <MetricCard title="Artículos más consumidos">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={consumptionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={<CustomConsumptionTick />}
                  width={80}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    value,
                    props.payload.fullName,
                  ]}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {consumptionData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MetricCard>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
