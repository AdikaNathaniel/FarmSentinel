
'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateDailyBriefingAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Sparkles, AlertTriangle, CloudSun, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Briefing
    </Button>
  );
}

export default function DailyBriefing() {
  const initialState = { message: null, result: null };
  const [state, dispatch] = useActionState(generateDailyBriefingAction, initialState);
  const { pending } = useFormStatus();

  return (
    <Card>
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>Daily Farm Briefing</CardTitle>
          <CardDescription>Get a personalized summary of today's conditions.</CardDescription>
        </CardHeader>
        <CardContent>
          {pending ? (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
          ) : state?.result ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <CloudSun className="h-5 w-5 text-blue-500" />
                </span>
                <div>
                  <h4 className="font-semibold">Weather Outlook</h4>
                  <p className="text-sm text-muted-foreground">{state.result.weather.summary}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </span>
                <div>
                  <h4 className="font-semibold">Bird Activity Forecast</h4>
                  <p className="text-sm text-muted-foreground">{state.result.birdActivity.prediction}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <ShieldCheck className="h-5 w-5 text-red-500" />
                </span>
                <div>
                  <h4 className="font-semibold">System Status</h4>
                  <p className="text-sm text-muted-foreground">{state.result.systemStatus.summary}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your daily briefing will appear here.</p>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Click to generate a comprehensive overview of today's farm status.
            </p>
            <SubmitButton />
        </CardFooter>
        {state.message && (
             <Alert variant="destructive" className="m-6 mt-0">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}
      </form>
    </Card>
  );
}
