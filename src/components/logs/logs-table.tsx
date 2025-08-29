'use client';

import React, { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';
import { mockLogs, mockNodes } from '@/lib/mock-data';
import type { Log } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export default function LogsTable() {
  const [nodeFilter, setNodeFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();

  const eventTypes = ['alert', 'connection', 'disconnection', 'system'];

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const isNodeMatch = nodeFilter === 'all' || !log.nodeId || log.nodeId === nodeFilter;
      const isEventTypeMatch = eventTypeFilter === 'all' || log.eventType === eventTypeFilter;

      let isDateMatch = true;
      if (dateFilter?.from) {
        const logDate = new Date(log.timestamp);
        if (dateFilter.to) {
          // Date range
          isDateMatch = isWithinInterval(logDate, { start: dateFilter.from, end: dateFilter.to });
        } else {
          // Single date
          isDateMatch = format(logDate, 'yyyy-MM-dd') === format(dateFilter.from, 'yyyy-MM-dd');
        }
      }
      
      return isNodeMatch && isEventTypeMatch && isDateMatch;
    });
  }, [nodeFilter, eventTypeFilter, dateFilter]);

  const getEventTypeBadge = (eventType: Log['eventType']) => {
    switch (eventType) {
        case 'alert':
            return <Badge variant="destructive">Alert</Badge>;
        case 'connection':
            return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Connection</Badge>;
        case 'disconnection':
            return <Badge className="bg-yellow-400/20 text-yellow-600 border-yellow-400/50">Disconnection</Badge>;
        case 'system':
            return <Badge variant="secondary">System</Badge>;
    }
  }

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
          
          {/* Event Type Filter */}
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Event Type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
              ))}
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
              <TableHead>Timestamp</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log: Log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(new Date(log.timestamp), 'PPpp')}</TableCell>
                  <TableCell className="font-medium">{log.nodeId || 'System'}</TableCell>
                  <TableCell>{getEventTypeBadge(log.eventType)}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
