'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { mockNodeActivations } from '@/lib/mock-data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  'FS-N001': { label: 'Node 1', color: 'hsl(var(--chart-1))' },
  'FS-N002': { label: 'Node 2', color: 'hsl(var(--chart-2))' },
  'FS-N004': { label: 'Node 4', color: 'hsl(var(--chart-3))' },
  'FS-N006': { label: 'Node 6', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export default function NodeActivationChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={mockNodeActivations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip content={<ChartTooltipContent />} />
        {Object.keys(chartConfig).map((key) => (
          <Line key={key} dataKey={key} type="monotone" stroke={`var(--color-${key})`} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
