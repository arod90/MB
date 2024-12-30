// components/MixConsumoPieChart.jsx
'use client';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = [
  // '#FF6384', // Red
  // '#36A2EB', // Blue
  // '#FFCE56', // Yellow
  // '#4BC0C0', // Teal
  '#9966FF', // Purple
  '#FF9F40', // Orange
];

const MixConsumoPieChart = ({ metrics }) => {
  if (!metrics?.productMix) return null;

  // Prepare chart data
  const chartData = Object.entries(metrics.productMix).map(
    ([category, { revenue }]) => ({
      category: category === 'bebidas' ? 'Bebidas' : 'Alimentos',
      revenue,
    })
  );

  // Calculate total revenue for percentage calculations
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  // Extract top Alimento and Bebida
  const topAlimento = metrics.topAlimento.name;
  const topBebida = metrics.topBebida.name;

  return (
    <Card className="flex flex-col items-center text-center justify-center w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Mix de Consumo</CardTitle>
        <CardDescription>
          Proporción de alimentos y bebidas que suelen ordenar los clientes de
          hoy
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto w-full h-full">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `${((value / totalRevenue) * 100).toFixed(
                    1
                  )}% (${new Intl.NumberFormat('es-EC', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value)})`,
                  name,
                ]}
              />
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="category"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={5}
                label={({ percent, value }) =>
                  `${(percent * 100).toFixed(1)}% (${new Intl.NumberFormat(
                    'es-EC',
                    { style: 'currency', currency: 'USD' }
                  ).format(value)})`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

                {/* Center Label */}
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-xl font-semibold"
                        >
                          Mix
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

      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          <strong>Top Alimento:</strong> {topAlimento}
        </div>
        <div className="leading-none text-muted-foreground">
          <strong>Top Bebida:</strong> {topBebida}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MixConsumoPieChart;
