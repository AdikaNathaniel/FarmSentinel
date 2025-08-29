'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';
import { mockAlerts, mockNodes } from '@/lib/mock-data';
import type { Alert } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export default function AlertsTable() {
  const [nodeFilter, setNodeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();

  const filteredAlerts = useMemo(() => {
    return mockAlerts.filter((alert) => {
      const isNodeMatch = nodeFilter === 'all' || alert.nodeId === nodeFilter;
      const isSeverityMatch = severityFilter === 'all' || alert.severity === severityFilter;

      let isDateMatch = true;
      if (dateFilter?.from) {
        const alertDate = new Date(alert.timestamp);
        if (dateFilter.to) {
          // Date range
          isDateMatch = isWithinInterval(alertDate, { start: dateFilter.from, end: dateFilter.to });
        } else {
          // Single date
          isDateMatch = format(alertDate, 'yyyy-MM-dd') === format(dateFilter.from, 'yyyy-MM-dd');
        }
      }
      
      return isNodeMatch && isSeverityMatch && isDateMatch;
    });
  }, [nodeFilter, severityFilter, dateFilter]);

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-400/20 text-yellow-600 border-yellow-400/50">Medium</Badge>;
      case 'high':
        return <Badge variant="destructive">High</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Node Filter */}
          <Select value={nodeFilter} onValueChange={setNodeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Node..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nodes</SelectItem>
              {mockNodes.map(node => (
                <SelectItem key={node.id} value={node.id}>{node.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Severity Filter */}
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Severity..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-auto",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter?.from ? (
                  dateFilter.to ? (
                    <>
                      {format(dateFilter.from, "LLL dd, y")} -{" "}
                      {format(dateFilter.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateFilter.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateFilter?.from}
                selected={dateFilter}
                onSelect={setDateFilter}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert: Alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.nodeId}</TableCell>
                  <TableCell>{format(new Date(alert.timestamp), 'PPpp')}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell>
                    {alert.photoUrl ? (
                       <Popover>
                         <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">View</Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-80">
                            <Image src={alert.photoUrl} width={600} height={400} alt={`Alert photo from ${alert.nodeId}`} className="rounded-md" data-ai-hint="bird farm"/>
                         </PopoverContent>
                       </Popover>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No alerts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
