
'use server';

/**
 * @fileOverview A tool for fetching the farm's system status.
 */

import { ai } from '@/ai/genkit';
import { mockNodes, mockAlerts } from '@/lib/mock-data';
import { z } from 'zod';
import { isToday } from 'date-fns';

export const getSystemStatusTool = ai.defineTool(
  {
    name: 'getSystemStatus',
    description: 'Returns a summary of the farm\'s system status, including node health and recent critical alerts.',
    inputSchema: z.object({}), // No input needed
    outputSchema: z.object({
        offlineNodes: z.number().describe('The number of nodes currently inactive or in an error state.'),
        lowBatteryNodes: z.number().describe('The number of nodes with low battery.'),
        criticalAlertsToday: z.number().describe('The number of "high" severity alerts for the current day.'),
    }),
  },
  async () => {
    // In a real app, this data would be fetched from a live database.
    const offlineNodes = mockNodes.filter(n => n.status === 'inactive' || n.health === 'error').length;
    const lowBatteryNodes = mockNodes.filter(n => n.health === 'warning').length;
    const criticalAlertsToday = mockAlerts.filter(a => a.severity === 'high' && isToday(new Date(a.timestamp))).length;

    return {
        offlineNodes,
        lowBatteryNodes,
        criticalAlertsToday,
    };
  }
);
