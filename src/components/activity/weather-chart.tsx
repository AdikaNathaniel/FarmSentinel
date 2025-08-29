'use client';

import { Legend, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { format } from 'date-fns';

const chartConfig = {
  tempHigh: {
    label: 'High Temp (°C)',
    color: 'hsl(var(--chart-2))',
  },
  tempLow: {
    label: 'Low Temp (°C)',
    color: 'hsl(var(--chart-1))',
  },
  precipitation: {
    label: 'Precipitation (mm)',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface WeatherChartProps {
  data: {
    date: string;
    tempHigh: number;
    tempLow: number;
    precipitation: number;
  }[];
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const chartData = data.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'EEE d'),
  }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="dateFormatted" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tickMargin={8} unit="°C" />
        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} unit="mm" />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar yAxisId="right" dataKey="precipitation" fill="var(--color-precipitation)" radius={[4, 4, 0, 0]} />
        <Line yAxisId="left" dataKey="tempHigh" type="monotone" stroke="var(--color-tempHigh)" strokeWidth={2} dot={true} />
        <Line yAxisId="left" dataKey="tempLow" type="monotone" stroke="var(--color-tempLow)" strokeWidth={2} dot={true} />
      </ComposedChart>
    </ChartContainer>
  );
}
