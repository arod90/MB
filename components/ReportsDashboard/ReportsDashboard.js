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
import {
  BarChart,
  PieChart,
  LineChart,
  Bar,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  Cell,
  LabelList,
} from 'recharts';
import useWindowSize from '@/hooks/useWindowSize';
import { TrendingUp } from 'lucide-react';

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

/* ------------------------------------------------------------------
   Example: GenderDistributionChart
   Key layout changes: h-full + flex-col
------------------------------------------------------------------- */
export function GenderDistributionChart({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key === 'm' ? 'Masculino' : 'Femenino',
    value,
    fill: key === 'm' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
  }));
  const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const chartConfig = {
    value: { label: 'Total' },
    Masculino: { label: 'Masculino', color: 'hsl(var(--chart-1))' },
    Femenino: { label: 'Femenino', color: 'hsl(var(--chart-2))' },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-0">
        <CardTitle>Distribución por Género</CardTitle>
        <CardDescription>Año 2024</CardDescription>
      </CardHeader>

      {/* Let the card content stretch */}
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

      <CardFooter className="flex-col gap-2 text-sm items-center text-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Datos de género recopilados durante el último año
        </div>
      </CardFooter>
    </Card>
  );
}

/* ------------------------------------------------------------------
   Example: AgeDistributionChart
   Same approach: flex-col h-full
------------------------------------------------------------------- */
function AgeDistributionChart({ data }) {
  const chartData = Object.entries(data).map(([range, value]) => ({
    name: range,
    value,
    fill: 'hsl(var(--chart-1))',
  }));

  const chartConfig = {
    value: { label: 'Cantidad' },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Distribución por Edad</CardTitle>
        <CardDescription>Rangos de edad de clientes</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-sm" />
              <YAxis className="text-sm" />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------
   Example: CivilStatusChart
   Notice we remove pixel heights, using flex-1 where needed
------------------------------------------------------------------- */
export function CivilStatusChart({ data }) {
  // Example usage...
  const chartData = Object.entries(data).map(([status, value], index) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    // You can generate fill color dynamically or statically
    fill: `hsl(var(--chart-${(index % 4) + 1}))`,
  }));

  const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const chartConfig = {
    value: { label: 'Total' },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-0">
        <CardTitle>Estado Civil</CardTitle>
        <CardDescription>Distribución por estado civil</CardDescription>
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
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending down by 3% this month
          {/* You can flip the icon */}
          <TrendingUp className="rotate-180 h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Datos obtenidos en los últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}

/* ------------------------------------------------------------------
   Example: ConsumptionChart
   Remove the h-[600px], etc. in favor of "flex flex-col h-full"
------------------------------------------------------------------- */

function ConsumptionChart({ data, showCoverCharges, setShowCoverCharges }) {
  // If you want to show all items (no `slice`), remove or adjust this as needed:
  const chartData = data; // or data.slice(0, 50) if you have a huge list

  // For a vertical bar chart, each bar might take ~40 pixels in height
  // You can adjust 40 up/down based on your label size, etc.
  const chartHeight = chartData.length * 40;

  const chartConfig = {
    value: { label: 'Cantidad' },
  };

  return (
    // Let the card grow and shrink in the parent; no fixed height
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
              } relative inline-flex h-7 w-12 items-center 
                rounded-full transition-colors focus:outline-none 
                focus:ring-2 focus:ring-primary focus:ring-offset-2`}
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

      {/* 
        CardContent is scrollable (overflow-auto).
        We'll dynamically size the chart so it can exceed the parent’s height 
        => user can scroll within this card.
      */}
      <CardContent className="flex-1 overflow-auto">
        <ChartContainer config={chartConfig} className="w-full">
          {/* 
            A wrapper <div> that sets the total height of the chart 
            based on how many items we have. 
            If chartHeight is larger than the parent’s available space,
            the parent’s `overflow-auto` will kick in for scrolling.
          */}
          <div style={{ height: chartHeight, minWidth: 300 /* optional */ }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                  tick={<TruncateYAxisTick />} // keep your custom tick
                />
                {/* Custom tooltip that shows the full item name and quantity */}
                <Tooltip
                  cursor={false} // or { fill: 'transparent' } if you prefer a transparent cursor
                  wrapperStyle={{ pointerEvents: 'none' }} // prevents the tooltip from pushing the bars
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
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 4) + 1}))`}
                    />
                  ))}
                </Bar>

                {/*
                  If you want a custom tooltip again, just re-enable it:
                  <ChartTooltip
                    content={({ payload }) => { ... }}
                  />
                */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------
   Example: RevenueMetricsCard
   Again, remove fixed heights in favor of "h-full".
------------------------------------------------------------------- */
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

/* ------------------------------------------------------------------
   The main ReportsDashboard component:
   - Make it fill the parent’s height
   - Put date picker in a small top area
   - Then the grid in flex-1 (scroll if needed)
------------------------------------------------------------------- */

const isCoverCharge = (itemName) => {
  const coverChargeKeywords = ['AP. MUSICAL', 'COVER'];
  return coverChargeKeywords.some((keyword) => itemName.includes(keyword));
};

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
      const formattedStartDate = format(startDate, 'dd-MM-yyyy');
      const formattedEndDate = format(endDate, 'dd-MM-yyyy');
      const url = `${process.env.NEXT_PUBLIC_AWS_URL}noche/report?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      const response = await fetch(url);
      const data = await response.json();
      setReportData(data.data);
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
    .slice(0, 15); // MAS ITEMS SUBE SLICE

  return (
    // 1) Full height, column layout
    <div className="flex flex-col h-[93%]">
      {/* Date Picker Section (flex-none) */}
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

      {/* 2) The grid area (flex-1), scroll if needed */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {/* 
          Define a 2-row grid in MD: 
          row 1 height: 1fr, row 2 height: 1fr (or auto if you prefer).
          The consumption chart spans 2 rows. 
        */}
        <div className="h-full grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
          {/* Row 1 */}
          <div className="col-span-1 md:col-span-3 md:row-span-1 h-full">
            <RevenueMetricsCard reportData={reportData} />
          </div>
          <div className="col-span-1 md:col-span-3 md:row-span-1 h-full">
            <AgeDistributionChart data={reportData.Edad} />
          </div>

          {/* The big chart that spans 2 rows */}
          <div className="col-span-1 md:col-span-6 md:row-span-2 h-full">
            <ConsumptionChart
              data={consumptionData}
              showCoverCharges={showCoverCharges}
              setShowCoverCharges={setShowCoverCharges}
            />
          </div>

          {/* Row 2 */}
          <div className="col-span-1 md:col-span-3 h-full">
            <GenderDistributionChart data={reportData.GeneroEstimado} />
          </div>
          <div className="col-span-1 md:col-span-3 h-full">
            <CivilStatusChart data={reportData.EstadoCivil} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   getLatestAvailableDate helper
------------------------------------------------------------------- */
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
