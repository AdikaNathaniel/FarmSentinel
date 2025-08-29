
'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { predictBirdActivityAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Feather } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import BirdDetectionFrequencyChart from '../activity/bird-detection-frequency-chart';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Feather className="mr-2 h-4 w-4" />}
      Predict Activity
    </Button>
  );
}

export default function BirdActivityPredictor() {
  const initialState = { message: null, result: null };
  const [state, dispatch] = useActionState(predictBirdActivityAction, initialState);

  return (
    <Card className="flex flex-col h-full">
      <form action={dispatch} className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Bird Activity Prediction</CardTitle>
          <CardDescription>Analyzes recent detection frequency to predict future activity.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <p className="text-sm text-muted-foreground">
            Based on the 24-hour detection frequency data shown below. Click predict to get an AI-powered forecast.
          </p>
          <div className="h-48">
             <BirdDetectionFrequencyChart />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          {state.message && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {state.result && (
            <Alert>
              <Feather className="h-4 w-4" />
              <AlertTitle className="capitalize">Predicted Activity: {state.result.activityLevel}</AlertTitle>
              <AlertDescription>{state.result.reasoning}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
