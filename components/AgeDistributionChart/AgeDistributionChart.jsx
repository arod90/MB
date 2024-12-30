import React from 'react';
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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function AgeDistributionChart({ data }) {
  // Transform the data for the chart
  const chartData = Object.entries(data).map(([range, value]) => ({
    range,
    value,
    fill: 'hsl(var(--chart-1))',
  }));

  // Calculate average age
  const calculateAverageAge = (ageData) => {
    let totalAge = 0;
    let totalCount = 0;

    Object.entries(ageData).forEach(([range, count]) => {
      // Extract the middle value of each age range
      const [start, end] = range.split('-').map((num) => parseInt(num));
      const middleAge = end ? (start + end) / 2 : start + 5; // For '45+', assume it covers up to 55
      totalAge += middleAge * count;
      totalCount += count;
    });

    return totalCount > 0 ? Math.round(totalAge / totalCount) : 0;
  };

  const averageAge = calculateAverageAge(data);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Distribución por Edad</CardTitle>
        <CardDescription>Rangos de edad de clientes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-2">
        <ChartContainer config={{}} className="w-full h-[125%]">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: -20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="range"
                className="text-xs md:text-sm"
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis className="text-xs md:text-sm" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground text-center">
        <span className="mr-1">Edad promedio este periodo fue </span>
        <strong>{averageAge} años</strong>
      </CardFooter>
    </Card>
  );
}

export default AgeDistributionChart;
