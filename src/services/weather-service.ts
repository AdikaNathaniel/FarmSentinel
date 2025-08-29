'use server';

import type { WeatherData } from '@/lib/types';
import { addDays } from 'date-fns';

// This is a mock service. In a real application, you would replace this
// with a call to a real weather API like OpenWeatherMap, Weather.com, etc.
// using an API key stored securely as an environment variable.
export async function getWeeklyForecast(lat: number, lon: number): Promise<WeatherData[]> {
  // We're ignoring lat/lon for this mock service, but they would be used in a real API call.
  console.log(`Fetching mock weather for lat: ${lat}, lon: ${lon}`);

  const today = new Date('2025-06-25T12:00:00.000Z');
  const forecast: WeatherData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    let condition: WeatherData['condition'] = 'Sunny';
    if (i > 4) condition = 'Rain';
    else if (i > 2) condition = 'Cloudy';
    
    forecast.push({
      date: date.toISOString(),
      tempHigh: 25 + Math.sin(i) * 5 + (Math.random() - 0.5) * 2, // Celsius
      tempLow: 15 + Math.sin(i) * 4 + (Math.random() - 0.5) * 2, // Celsius
      precipitation: Math.max(0, Math.cos(i * 1.5) * 10 + (Math.random() - 0.7) * 5), // mm
      windSpeed: 10 + Math.random() * 15, // km/h
      condition: condition,
    });
  }

  // Round values for cleaner display
  forecast.forEach(day => {
      day.tempHigh = Math.round(day.tempHigh);
      day.tempLow = Math.round(day.tempLow);
      day.precipitation = Math.round(day.precipitation * 10) / 10;
      day.windSpeed = Math.round(day.windSpeed);
  });

  return Promise.resolve(forecast);
}
