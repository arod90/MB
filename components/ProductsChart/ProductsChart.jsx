import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Helper to identify cover charges
const COVER_KEYWORDS = [
  'AP. MUSICAL',
  'MUSICAL',
  'AP MUSICAL',
  'HOMBRES',
  'MUJERES',
];

const isCoverCharge = (itemName) => {
  const upperName = itemName.toUpperCase();
  return COVER_KEYWORDS.some((keyword) => upperName.includes(keyword));
};

// Truncated label component for Y-axis
const TruncateYAxisTick = ({ x, y, payload }) => {
  const labelCutoff = 25;
  const originalText = payload?.value || '';
  const truncated =
    originalText.length > labelCutoff
      ? originalText.substring(0, labelCutoff - 1) + '…'
      : originalText;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="currentColor"
        fontSize={11}
      >
        {truncated}
      </text>
    </g>
  );
};

const ProductsChart = ({ productSales }) => {
  const [showCoverCharges, setShowCoverCharges] = useState(true);

  // Filter and process the sales data
  const chartData = React.useMemo(() => {
    if (!productSales) return [];

    // Convert object to array and filter based on showCoverCharges
    const filteredData = Object.entries(productSales)
      .filter(([name]) => showCoverCharges || !isCoverCharge(name))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([name, value]) => ({
        name,
        fullName: name,
        value,
        isCover: isCoverCharge(name),
      }));

    return filteredData;
  }, [productSales, showCoverCharges]);

  return (
    <Card className="flex flex-col h-[600px] sm:h-full ">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Productos más Vendidos</CardTitle>
            <CardDescription>Top productos por cantidad</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cover</span>
            <Switch
              checked={showCoverCharges}
              onCheckedChange={setShowCoverCharges}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="w-full h-full">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 5, left: 85, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                className="stroke-muted"
              />
              <XAxis
                type="number"
                fontSize={11}
                className="text-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={<TruncateYAxisTick />}
                tickLine={false}
                className="text-muted-foreground"
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  fontSize: '12px',
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  padding: '8px',
                }}
                formatter={(value, name, props) => [
                  value,
                  <span key="tooltip-title" className="font-medium">
                    {props.payload.fullName}
                  </span>,
                ]}
              />
              <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 4) + 1}))`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsChart;
