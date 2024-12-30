'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, subDays, isThursday, isFriday, isSaturday } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRangePicker } from 'react-date-range';
import { Switch } from '@headlessui/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import AgeDistributionChart from '../../components/AgeDistributionChart/AgeDistributionChart';
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Cell,
  LabelList,
} from 'recharts';
import useWindowSize from '@/hooks/useWindowSize';
// import { TrendingUp } from 'lucide-react';

// Trend calculation utility function
function calculateTrendInfo(data, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Helper function to calculate total from data
  const calculateTotal = (data) => {
    if (!data || typeof data !== 'object') return 0;
    return Object.values(data).reduce(
      (sum, value) => sum + (typeof value === 'number' ? value : 0),
      0
    );
  };

  // Calculate change percentage
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  // Helper to format "arriba/abajo por X%" with correct color
  const formatChangeSpan = (change, label) => {
    if (change === null) return null;
    const direction = change >= 0 ? 'arriba' : 'abajo';
    const colorClass = change >= 0 ? 'text-green-600' : 'text-red-600';
    const absChange = Math.abs(change).toFixed(1);
    return `${label} <span class="${colorClass}">${direction} por ${absChange}%</span>`;
  };

  // Check if it's a calendar month
  const isCalendarMonth =
    start.getDate() === 1 &&
    end.getDate() ===
      new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate() &&
    start.getMonth() === end.getMonth();

  // Check if it's any complete week (7 days)
  const isWeek = end - start === 6 * 24 * 60 * 60 * 1000; // exactly 7 days

  // Check if it's a calendar year
  const isCalendarYear =
    start.getMonth() === 0 &&
    start.getDate() === 1 &&
    end.getMonth() === 11 &&
    end.getDate() === 31 &&
    start.getFullYear() === end.getFullYear();

  // Decide the "period type" if any
  let periodType = null;
  if (isCalendarMonth) periodType = 'mes';
  if (isWeek) periodType = 'semana';
  if (isCalendarYear) periodType = 'año';

  // Build the bottom line if we have a known period and a previous period
  const buildBottomLine = () => {
    if (!periodType) return null; // not a "calendar" period
    if (!data.previousPeriod) return null; // no previous data
    return `Comparado con  ${periodType} anterior`;
  };

  // If we don’t have a previous period or not a calendar period, just show total
  if (!periodType || !data.previousPeriod) {
    return {
      topLine: `Total del período: ${calculateTotal(data)}`,
      bottomLine:
        periodType && !data.previousPeriod
          ? `No hay datos de la ${periodType} anterior`
          : 'Selecciona un mes, semana o año completo para ver comparaciones',
      isPositive: null,
    };
  }

  // ----------------------------------------------------------------
  //        GENDER DISTRIBUTION
  // ----------------------------------------------------------------
  if ('m' in data) {
    const currentTotal = calculateTotal(data);
    const previousTotal = calculateTotal(data.previousPeriod);

    const totalChange = calculateChange(currentTotal, previousTotal);
    const menChange = calculateChange(data.m || 0, data.previousPeriod?.m || 0);
    const womenChange = calculateChange(
      data.f || 0,
      data.previousPeriod?.f || 0
    );

    // Build top line:
    // e.g.: "Número de clientes arriba por X% • Hombres arriba por X% • Mujeres abajo por X%"
    let parts = [];
    const totalSpan = formatChangeSpan(totalChange, 'Número de clientes');
    if (totalSpan) parts.push(totalSpan);
    const menSpan = formatChangeSpan(menChange, 'Hombres');
    if (menSpan) parts.push(menSpan);
    const womenSpan = formatChangeSpan(womenChange, 'Mujeres');
    if (womenSpan) parts.push(womenSpan);

    const topLine =
      parts.length > 0
        ? parts.join(' <br/> ')
        : `Total del período: ${currentTotal}`; // fallback

    return {
      topLine,
      bottomLine: buildBottomLine() || '',
      isPositive: totalChange >= 0,
    };
  }

  // ----------------------------------------------------------------
  //        CIVIL STATUS
  // ----------------------------------------------------------------
  if (
    Object.keys(data).some((key) =>
      ['soltero', 'casado', 'divorciado'].includes(key)
    )
  ) {
    const currentTotal = calculateTotal(data);
    const previousTotal = calculateTotal(data.previousPeriod);
    const totalChange = calculateChange(currentTotal, previousTotal);

    // Build top line with changes for soltero, casado, divorciado
    // If a certain key doesn't exist in data, skip it
    let parts = [];

    // We'll look for known keys, but you can adapt as needed
    const statuses = ['soltero', 'casado', 'divorciado'];
    statuses.forEach((statusKey) => {
      if (statusKey in data) {
        const statusChange = calculateChange(
          data[statusKey] || 0,
          data.previousPeriod?.[statusKey] || 0
        );
        const label =
          statusKey.charAt(0).toUpperCase() + statusKey.slice(1) + 's'; // Solteros, Casados, Divorciados
        const statusSpan = formatChangeSpan(statusChange, label);
        if (statusSpan) parts.push(statusSpan);
      }
    });

    const topLine =
      parts.length > 0
        ? parts.join(' <br/> ')
        : `Total del período: ${currentTotal}`; // fallback

    return {
      topLine,
      bottomLine: buildBottomLine() || '',
      isPositive: totalChange >= 0,
    };
  }

  // ----------------------------------------------------------------
  // DEFAULT / NO MATCH
  // ----------------------------------------------------------------
  return {
    topLine: `Total del período: ${calculateTotal(data)}`,
    bottomLine:
      'Selecciona un mes, semana o año completo para ver comparaciones',
    isPositive: null,
  };
}

const TruncateYAxisTick = ({ x, y, payload }) => {
  const labelCutoff = 12;
  const originalText = payload?.value || '';
  const truncated =
    originalText.length > labelCutoff
      ? originalText.substring(0, labelCutoff - 1) + '…'
      : originalText;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={-2}
        dy={4}
        fill="currentColor"
        fontSize={12}
        textAnchor="end"
        style={{ whiteSpace: 'nowrap' }}
      >
        {truncated}
      </text>
    </g>
  );
};

export function GenderDistributionChart({ data, startDate, endDate }) {
  const { previousPeriod, ...currentData } = data;

  const chartData = Object.entries(currentData).map(([key, value]) => ({
    name: key === 'm' ? 'Masculino' : 'Femenino',
    value,
    fill: key === 'm' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
  }));

  const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Use the updated function
  const trendInfo = calculateTrendInfo(data, startDate, endDate);

  const chartConfig = {
    value: { label: 'Total' },
    Masculino: { label: 'Masculino', color: 'hsl(var(--chart-1))' },
    Femenino: { label: 'Femenino', color: 'hsl(var(--chart-2))' },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-0">
        <CardTitle>Distribución por Género</CardTitle>
        <CardDescription>Datos del período seleccionado</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      {/* Footer: top line (bold, can contain HTML) + bottom line (muted) */}
      <CardFooter className="flex-col gap-2 text-sm items-center text-center">
        {/* topLine as bold */}
        <div
          className="font-medium leading-none"
          // Use "dangerouslySetInnerHTML" since topLine might contain <span> tags
          dangerouslySetInnerHTML={{ __html: trendInfo.topLine }}
        />
        {/* If isPositive is not null, show arrow */}
        {/* {trendInfo.isPositive !== null && (
          <TrendingUp
            className={`h-4 w-4 ${
              !trendInfo.isPositive
                ? 'rotate-180 text-red-600'
                : 'text-green-600'
            }`}
          />
        )} */}

        {/* bottomLine as smaller text */}
        <div className="leading-none text-muted-foreground text-sm">
          {trendInfo.bottomLine}
        </div>
      </CardFooter>
    </Card>
  );
}

export function CivilStatusChart({ data, startDate, endDate }) {
  // Extract just the civil status data without the previousPeriod
  const { previousPeriod, ...currentData } = data;

  const chartData = Object.entries(currentData).map(
    ([status, value], index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value,
      fill: `hsl(var(--chart-${(index % 4) + 1}))`,
    })
  );

  const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const trendInfo = calculateTrendInfo(data, startDate, endDate);

  const chartConfig = {
    value: { label: 'Total' },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-0">
        <CardTitle>Estado Civil</CardTitle>
        <CardDescription>Datos del período seleccionado</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm items-center text-center">
        <div
          className="font-medium leading-none"
          dangerouslySetInnerHTML={{ __html: trendInfo.topLine }}
        />
        {/* {trendInfo.isPositive !== null && (
          <TrendingUp
            className={`h-4 w-4 ${
              !trendInfo.isPositive
                ? 'rotate-180 text-red-600'
                : 'text-green-600'
            }`}
          />
        )} */}

        <div className="leading-none text-muted-foreground text-sm">
          {trendInfo.bottomLine}
        </div>
      </CardFooter>
    </Card>
  );
}

// function AgeDistributionChart({ data }) {
//   const chartData = Object.entries(data).map(([range, value]) => ({
//     name: range,
//     value,
//     fill: 'hsl(var(--chart-1))',
//   }));

//   const chartConfig = {
//     value: { label: 'Cantidad' },
//   };

//   return (
//     <Card className="flex flex-col h-full">
//       <CardHeader>
//         <CardTitle>Distribución por Edad</CardTitle>
//         <CardDescription>Rangos de edad de clientes</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 flex items-center justify-center">
//         <ChartContainer config={chartConfig} className="h-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData} margin={{ left: 0, right: 30 }}>
//               <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//               <XAxis dataKey="name" className="text-sm" />
//               <YAxis className="text-sm" />
//               <Bar
//                 dataKey="value"
//                 fill="hsl(var(--chart-1))"
//                 radius={[4, 4, 0, 0]}
//               />
//               <ChartTooltip />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

function ConsumptionChart({ data, showCoverCharges, setShowCoverCharges }) {
  const chartConfig = {
    value: { label: 'Cantidad' },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Artículos más consumidos</CardTitle>
            <CardDescription>Top productos por cantidad</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cover</span>
            <Switch
              checked={showCoverCharges}
              onChange={setShowCoverCharges}
              className={`${
                showCoverCharges ? 'bg-primary' : 'bg-gray-200'
              } relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span
                className={`${
                  showCoverCharges ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-5 w-5 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <ChartContainer config={chartConfig} className="w-full">
          <div style={{ height: `${data.length * 40}px`, minWidth: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal
                  vertical={false}
                  className="stroke-muted"
                />
                <XAxis type="number" className="text-sm" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={<TruncateYAxisTick />}
                />
                <Tooltip
                  cursor={false}
                  wrapperStyle={{ pointerEvents: 'none' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const { fullName, value } = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded p-2 shadow text-sm">
                        <div className="font-semibold">{fullName}</div>
                        <div>Cantidad: {value}</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill="hsl(var(--foreground))"
                    style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                  />
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 4) + 1}))`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RevenueMetricsCard({ reportData }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Métricas Clave</CardTitle>
        <CardDescription>Resumen de actividad</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-background to-muted">
            <p className="text-sm text-muted-foreground">
              Número de noches visualizadas
            </p>
            <p className="text-3xl font-bold">{reportData.NumNoches}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-background to-muted">
            <p className="text-sm text-muted-foreground">Total Facturación</p>
            <p className="text-3xl font-bold">
              ${reportData.Facturacion.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsDashboard() {
  const [state, setState] = useState([
    {
      startDate: getLatestAvailableDate(),
      endDate: getLatestAvailableDate(),
      key: 'selection',
    },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showCoverCharges, setShowCoverCharges] = useState(true);
  const pickerRef = useRef(null);
  const size = useWindowSize();

  useEffect(() => {
    fetchReportData(state[0].startDate, state[0].endDate);
  }, [state]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchReportData(startDate, endDate) {
    try {
      // Calculate the previous period
      const periodLength = endDate - startDate;
      const previousStartDate = new Date(startDate - periodLength);
      const previousEndDate = new Date(startDate);

      // Format all dates
      const formattedStartDate = format(startDate, 'dd-MM-yyyy');
      const formattedEndDate = format(endDate, 'dd-MM-yyyy');
      const formattedPreviousStartDate = format(
        previousStartDate,
        'dd-MM-yyyy'
      );
      const formattedPreviousEndDate = format(previousEndDate, 'dd-MM-yyyy');

      // Fetch both current and previous period data
      const [currentResponse, previousResponse] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_AWS_URL}noche/report?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_AWS_URL}noche/report?start_date=${formattedPreviousStartDate}&end_date=${formattedPreviousEndDate}`
        ),
      ]);

      const currentData = await currentResponse.json();
      const previousData = await previousResponse.json();

      setReportData({
        ...currentData.data,
        previousPeriod: previousData.data,
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  }

  const formatDisplayDate = () => {
    const { startDate, endDate } = state[0];
    const formatStr = "EEEE d 'de' MMMM yyyy";
    const start = format(startDate, formatStr, { locale: es });
    const formattedStart = start.charAt(0).toUpperCase() + start.slice(1);

    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return formattedStart;
    }

    const end = format(endDate, formatStr, { locale: es });
    const formattedEnd = end.charAt(0).toUpperCase() + end.slice(1);
    return `${formattedStart} - ${formattedEnd}`;
  };

  if (!reportData) return <div>Loading...</div>;

  const monthsToShow = size.width <= 768 ? 1 : 2;

  // Show top 30 items in consumption chart
  const consumptionData = Object.entries(reportData.Consumos)
    .filter(([item]) => (showCoverCharges ? true : !isCoverCharge(item)))
    .map(([item, quantity]) => ({
      name: item.length > 20 ? item.substring(0, 20) + '...' : item,
      fullName: item,
      value: quantity,
      isCoverCharge: isCoverCharge(item),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  return (
    <div className="flex flex-col h-[93%]">
      {/* Date Picker Section */}
      <div className="flex-none p-4">
        <div className="mb-4 relative">
          <div className="flex items-center gap-4">
            <button
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors duration-200"
              onClick={() => setIsVisible(!isVisible)}
            >
              Seleccionar Fechas
            </button>
            <span className="text-base lg:text-lg font-medium text-foreground">
              {formatDisplayDate()}
            </span>
          </div>
          {isVisible && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" />
              <div
                ref={pickerRef}
                className="absolute mt-2 z-50 bg-background rounded-lg shadow-lg overflow-hidden"
              >
                <DateRangePicker
                  onChange={(item) => setState([item.selection])}
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
      </div>

      {/* Charts Grid */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="h-full grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
          <div className="col-span-1 md:col-span-3 md:row-span-1 h-full">
            <RevenueMetricsCard reportData={reportData} />
          </div>
          <div className="col-span-1 md:col-span-3 md:row-span-1 h-full">
            <AgeDistributionChart data={reportData.Edad} />
          </div>
          <div className="col-span-1 md:col-span-6 md:row-span-2 h-full">
            <ConsumptionChart
              data={consumptionData}
              showCoverCharges={showCoverCharges}
              setShowCoverCharges={setShowCoverCharges}
            />
          </div>
          <div className="col-span-1 md:col-span-3 h-full">
            <GenderDistributionChart
              data={{
                ...reportData.GeneroEstimado,
                previousPeriod: reportData.previousPeriod?.GeneroEstimado,
              }}
              startDate={state[0].startDate}
              endDate={state[0].endDate}
            />
          </div>
          <div className="col-span-1 md:col-span-3 h-full">
            <CivilStatusChart
              data={{
                ...reportData.EstadoCivil,
                previousPeriod: reportData.previousPeriod?.EstadoCivil,
              }}
              startDate={state[0].startDate}
              endDate={state[0].endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function getLatestAvailableDate() {
  const now = new Date();
  let latestDate;

  if (now.getHours() < 12) {
    latestDate = subDays(now, 2);
  } else {
    latestDate = subDays(now, 1);
  }

  while (
    !isThursday(latestDate) &&
    !isFriday(latestDate) &&
    !isSaturday(latestDate)
  ) {
    latestDate = subDays(latestDate, 1);
  }

  return latestDate;
}

function isCoverCharge(itemName) {
  const coverChargeKeywords = ['AP. MUSICAL', 'COVER'];
  return coverChargeKeywords.some((keyword) => itemName.includes(keyword));
}
