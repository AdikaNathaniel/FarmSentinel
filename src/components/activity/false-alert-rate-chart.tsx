'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { mockFalseAlertRate } from '@/lib/mock-data';
import type { ChartConfig } from '@/components/ui/chart';
import { format } from 'date-fns';

const chartConfig = {
  rate: {
    label: 'False Alert Rate (%)',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function FalseAlertRateChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={mockFalseAlertRate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => format(new Date(value), 'MMM d')}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="%" />
        <Tooltip content={<ChartTooltipContent />} />
        <Line dataKey="rate" type="monotone" stroke="var(--color-rate)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
