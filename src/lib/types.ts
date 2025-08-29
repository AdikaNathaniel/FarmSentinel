
export type User = {
  uid: string;
  name: string | null;
  email: string | null;
  role?: 'admin' | 'viewer';
  phone?: string;
  farmInfo?: {
    name: string;
    size: string;
    latitude: string;
    longitude: string;
  };
};

export type Node = {
  id: string;
  location: {
    x: number;
    y: number;
  };
  status: 'active' | 'inactive';
  lastPing: string;
  battery: number;
  health: 'ok' | 'warning' | 'error';
};

export type Alert = {
  id: string;
  nodeId: string;
  timestamp: string;
  photoUrl?: string;
  severity: 'low' | 'medium' | 'high';
};

export type Log = {
  id: string;
  timestamp: string;
  nodeId?: string;
  eventType: 'alert' | 'connection' | 'disconnection' | 'system';
  details: string;
};

export interface WeatherData {
  date: string;
  tempHigh: number;
  tempLow: number;
  precipitation: number;
  windSpeed: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Thunderstorm' | 'Snow';
}
