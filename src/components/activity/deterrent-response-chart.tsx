
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { mockDeterrentResponses } from '@/lib/mock-data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  speaker: { label: 'Speaker', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

export default function DeterrentResponseChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={mockDeterrentResponses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip content={<ChartTooltipContent />} />
        <Line dataKey="speaker" type="monotone" stroke="var(--color-speaker)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
