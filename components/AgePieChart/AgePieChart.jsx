'use client';
import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from 'recharts';
import { useClientContext } from '@/context/ClientContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from '@/components/ui/chart';

const AgePieChart = () => {
  const { clients } = useClientContext();

  // 1) Calculate the average age
  const averageAge = React.useMemo(() => {
    if (!clients || clients.length === 0) return 0;
    const totalAge = clients.reduce(
      (sum, client) => sum + (client.Edad || 0),
      0
    );
    return totalAge / clients.length;
  }, [clients]);

  // 2) Transform your demographics data into an array
  //    Suppose `metrics.demographics.age` looks like { "18-24": 10, "25-34": 8, "35-44": 7, "45+": 5 }
  //    We’ll assume you’re still calculating `metrics` in parent and passing it down
  //    Or you can do the same calculation here from `clients`.
  const [metrics, setMetrics] = useState(null);

  React.useEffect(() => {
    // ... replicate your existing `calculateMetrics()` logic or fetch it from somewhere ...
    // setMetrics(calculateMetrics())
    // For demonstration, I'm just mocking some data:
    setMetrics({
      demographics: {
        age: {
          '18-24': 10,
          '25-34': 8,
          '35-44': 7,
          '45+': 5,
        },
      },
    });
  }, []);

  if (!metrics?.demographics?.age) return null;

  // 3) Convert your age distribution to an array structure for Recharts
  const chartData = Object.entries(metrics.demographics.age).map(
    ([ageRange, count], index) => ({
      ageRange,
      visitors: count,
      // We can define custom colors or use shadcn’s CSS variables
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    })
  );

  // 4) Render the Card with the donut PieChart
  return (
    <Card className="flex flex-col items-center justify-center w-full h-[400px] lg:h-[450px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Edad de los Clientes</CardTitle>
        <CardDescription>Distribución por Rango de Edad</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          // If you want to set up a ChartConfig, do so here
          config={{}}
          className="mx-auto aspect-square h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="ageRange"
              // Donut: set innerRadius
              innerRadius={70}
              strokeWidth={5}
            >
              {chartData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.fill} />
              ))}

              {/* 5) Center label showing average age */}
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
                          {Number.isNaN(averageAge) ? 0 : averageAge.toFixed(1)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Edad Promedio
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        {/* Optional Footer info */}
        <div className="leading-none text-muted-foreground">
          <strong> {clients?.length || 0} </strong> clientes han ingresado al
          local
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgePieChart;
