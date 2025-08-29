'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { mockDetectionFrequency } from '@/lib/mock-data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  detections: {
    label: 'Detections',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function BirdDetectionFrequencyChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <AreaChart data={mockDetectionFrequency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip
          cursor={{
            stroke: 'hsl(var(--border))',
            strokeWidth: 1,
            fill: 'hsl(var(--background))',
            radius: 4,
          }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="detections"
          type="monotone"
          fill="url(#colorDetections)"
          stroke="hsl(var(--chart-1))"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
