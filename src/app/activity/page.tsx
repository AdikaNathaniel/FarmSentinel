import { PageHeader } from "@/components/page-header";
import BirdDetectionFrequencyChart from "@/components/activity/bird-detection-frequency-chart";
import NodeActivationChart from "@/components/activity/node-activation-chart";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherForecast from "@/components/activity/weather-forecast";
import BirdActivityPredictor from "@/components/activity/bird-activity-predictor";

export default function ActivityPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Activity & Environment"
        description="Analyze bird activity and system performance."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Bird Detection Frequency</CardTitle>
            <CardDescription>Detections per hour over the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-64" />}>
              <BirdDetectionFrequencyChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Node Activation Count</CardTitle>
            <CardDescription>Activations per node in the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-64" />}>
              <NodeActivationChart />
            </Suspense>
          </CardContent>
        </Card>
        <Suspense fallback={<Skeleton className="h-[450px]" />}>
          <WeatherForecast />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[450px]" />}>
          <BirdActivityPredictor />
        </Suspense>
      </div>
    </div>
  );
}
