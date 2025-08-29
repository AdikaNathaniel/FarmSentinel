import type { Node, Alert, Log } from './types';
import { subDays, subHours, subMinutes } from 'date-fns';

const now = new Date('2025-06-25T12:00:00.000Z');

const generateMockNodes = (count: number): Node[] => {
  const nodes: Node[] = [];
  for (let i = 1; i <= count; i++) {
    const id = `FS-N${String(i).padStart(3, '0')}`;
    const status = Math.random() > 0.2 ? 'active' : 'inactive';
    const battery = status === 'inactive' && Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 101);
    let health: Node['health'] = 'ok';
    if (battery < 20 && battery > 0) {
        health = 'warning';
    } else if (battery === 0 || (status === 'inactive' && Math.random() > 0.7)) {
        health = 'error';
    }

    nodes.push({
      id,
      location: { x: Math.floor(Math.random() * 200), y: Math.floor(Math.random() * 200) },
      status,
      lastPing: subMinutes(now, Math.floor(Math.random() * 60 * (status === 'active' ? 1 : 24))).toISOString(),
      battery,
      health,
    });
  }
  return nodes;
};

export const mockNodes: Node[] = generateMockNodes(24);


export const mockAlerts: Alert[] = [
  { id: 'A001', nodeId: 'FS-N001', timestamp: subMinutes(now, 15).toISOString(), severity: 'low' },
  { id: 'A002', nodeId: 'FS-N002', timestamp: subHours(now, 1).toISOString(), severity: 'medium', photoUrl: 'https://placehold.co/600x400.png' },
  { id: 'A003', nodeId: 'FS-N004', timestamp: subHours(now, 3).toISOString(), severity: 'high' },
  { id: 'A004', nodeId: 'FS-N001', timestamp: subDays(now, 1).toISOString(), severity: 'medium' },
  { id: 'A005', nodeId: 'FS-N003', timestamp: subDays(now, 1).toISOString(), severity: 'low' },
  { id: 'A006', nodeId: 'FS-N002', timestamp: subDays(now, 2).toISOString(), severity: 'high', photoUrl: 'https://placehold.co/600x400.png' },
  { id: 'A007', nodeId: 'FS-N006', timestamp: subMinutes(now, 5).toISOString(), severity: 'high' },
  { id: 'A008', nodeId: 'FS-N008', timestamp: subHours(now, 8).toISOString(), severity: 'low' },
  { id: 'A009', nodeId: 'FS-N012', timestamp: subHours(now, 12).toISOString(), severity: 'medium', photoUrl: 'https://placehold.co/600x400.png' },
  { id: 'A010', nodeId: 'FS-N015', timestamp: subDays(now, 3).toISOString(), severity: 'high' },
  { id: 'A011', nodeId: 'FS-N007', timestamp: subDays(now, 4).toISOString(), severity: 'low' },
  { id: 'A012', nodeId: 'FS-N011', timestamp: subDays(now, 5).toISOString(), severity: 'medium' },
];

export const mockLogs: Log[] = [
    { id: 'L001', timestamp: subMinutes(now, 5).toISOString(), nodeId: 'FS-N006', eventType: 'alert', details: 'High severity alert triggered.' },
    { id: 'L002', timestamp: subMinutes(now, 15).toISOString(), nodeId: 'FS-N001', eventType: 'alert', details: 'Low severity alert triggered.' },
    { id: 'L003', timestamp: subMinutes(now, 20).toISOString(), eventType: 'system', details: 'System check completed successfully.' },
    { id: 'L004', timestamp: subHours(now, 1).toISOString(), nodeId: 'FS-N002', eventType: 'alert', details: 'Medium severity alert triggered.' },
    { id: 'L005', timestamp: subHours(now, 6).toISOString(), nodeId: 'FS-N003', eventType: 'disconnection', details: 'Node lost connection.' },
    { id: 'L006', timestamp: subHours(now, 7).toISOString(), nodeId: 'FS-N003', eventType: 'connection', details: 'Node re-established connection.' },
    { id: 'L007', timestamp: subDays(now, 2).toISOString(), nodeId: 'FS-N005', eventType: 'disconnection', details: 'Node offline. Battery depleted.' },
    { id: 'L008', timestamp: subHours(now, 8).toISOString(), nodeId: 'FS-N008', eventType: 'alert', details: 'Low severity alert triggered.' },
    { id: 'L009', timestamp: subHours(now, 12).toISOString(), nodeId: 'FS-N012', eventType: 'alert', details: 'Medium severity alert triggered.' },
    { id: 'L010', timestamp: subDays(now, 3).toISOString(), nodeId: 'FS-N015', eventType: 'alert', details: 'High severity alert triggered.' },
    { id: 'L011', timestamp: subDays(now, 3).toISOString(), eventType: 'system', details: 'Weekly maintenance cycle started.' },
    { id: 'L012', timestamp: subDays(now, 4).toISOString(), nodeId: 'FS-N018', eventType: 'connection', details: 'Node FS-N018 online.' },
];

export const mockDetectionFrequency = [
  { time: '00:00', detections: 5 },
  { time: '02:00', detections: 8 },
  { time: '04:00', detections: 15 },
  { time: '06:00', detections: 40 },
  { time: '08:00', detections: 60 },
  { time: '10:00', detections: 45 },
  { time: '12:00', detections: 30 },
  { time: '14:00', detections: 35 },
  { time: '16:00', detections: 55 },
  { time: '18:00', detections: 70 },
  { time: '20:00', detections: 25 },
  { time: '22:00', detections: 10 },
];

export const mockNodeActivations = [
  { time: '00:00', 'FS-N001': 2, 'FS-N002': 1, 'FS-N004': 3, 'FS-N006': 1 },
  { time: '04:00', 'FS-N001': 5, 'FS-N002': 4, 'FS-N004': 6, 'FS-N006': 3 },
  { time: '08:00', 'FS-N001': 15, 'FS-N002': 10, 'FS-N004': 20, 'FS-N006': 8 },
  { time: '12:00', 'FS-N001': 10, 'FS-N002': 8, 'FS-N004': 12, 'FS-N006': 5 },
  { time: '16:00', 'FS-N001': 18, 'FS-N002': 14, 'FS-N004': 25, 'FS-N006': 12 },
  { time: '20:00', 'FS-N001': 8, 'FS-N002': 5, 'FS-N004': 10, 'FS-N006': 4 },
];

export const mockDeterrentResponses = [
  { day: 'Mon', speaker: 45 },
  { day: 'Tue', speaker: 50 },
  { day: 'Wed', speaker: 55 },
  { day: 'Thu', speaker: 48 },
  { day: 'Fri', speaker: 60 },
  { day: 'Sat', speaker: 70 },
  { day: 'Sun', speaker: 65 },
];

export const mockFalseAlertRate = [
    { date: '2025-06-19', rate: 15 },
    { date: '2025-06-20', rate: 14 },
    { date: '2025-06-21', rate: 12 },
    { date: '2025-06-22', rate: 10 },
    { date: '2025-06-23', rate: 11 },
    { date: '2025-06-24', rate: 9 },
    { date: '2025-06-25', rate: 7 },
];
