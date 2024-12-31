// components/MixConsumoPieChart.jsx
'use client';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  Legend,
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
      fill: COLORS[category === 'bebidas' ? 0 : 1],
    })
  );

  // Calculate total revenue for percentage calculations
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  // Extract top Alimento and Bebida
  const topAlimento = metrics.topAlimento.name;
  const topBebida = metrics.topBebida.name;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>Mix de Consumo</CardTitle>
        <CardDescription>
          Proporción de consumo de alimentos y bebidas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center pb-4">
        <ChartContainer config={{}} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  name,
                  `
                  (${new Intl.NumberFormat('es-EC', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value)})`,
                ]}
              />
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="category"
                innerRadius={50}
                outerRadius={120}
                paddingAngle={5}
              >
                <LabelList
                  dataKey="revenue"
                  position="inside"
                  className="fill-white"
                  stroke="none"
                  fontSize={14}
                  formatter={(value) =>
                    `${((value / totalRevenue) * 100).toFixed(1)}%`
                  }
                />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              {/* <Legend
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                layout="horizontal"
                wrapperStyle={{ marginTop: '10px' }}
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-2 text-sm">
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
