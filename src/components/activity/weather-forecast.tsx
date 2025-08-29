
'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getWeatherForecastAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, CloudSun } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import WeatherChart from './weather-chart';
import { Skeleton } from '../ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudSun className="mr-2 h-4 w-4" />}
      Get 7-Day Forecast
    </Button>
  );
}

export default function WeatherForecast() {
  const initialState = { message: null, result: null };
  const [state, dispatch] = useActionState(getWeatherForecastAction, initialState);

  return (
    <Card className="flex flex-col h-full">
      <form action={dispatch} className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Get an AI-powered weather summary and 7-day forecast for your farm.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to fetch the latest weather data for your configured location.
          </p>
          <div className="h-64">
             {state?.result?.forecast ? (
                <WeatherChart data={state.result.forecast} />
             ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center text-muted-foreground">
                        <CloudSun className="mx-auto h-12 w-12" />
                        <p className="mt-2">Your weather chart will appear here.</p>
                    </div>
                </div>
             )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          {state?.message && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {state?.result?.summary && (
            <Alert>
              <CloudSun className="h-4 w-4" />
              <AlertTitle className="capitalize">Weekly Weather Outlook</AlertTitle>
              <AlertDescription>{state.result.summary}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
