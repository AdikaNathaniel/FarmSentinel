
'use client';

import { PageHeader } from "@/components/page-header";
import HealthCards from "@/components/dashboard/health-cards";
import RecentAlerts from "@/components/dashboard/recent-alerts";
import ActivitySlideshow from "@/components/dashboard/activity-slideshow";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DailyBriefing from "@/components/dashboard/daily-briefing";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="An overview of your farm's status and bird activity."
      />

      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <HealthCards />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[250px] w-full" />}>
        <DailyBriefing />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ActivitySlideshow />
          </Suspense>
        </div>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <RecentAlerts />
        </Suspense>
      </div>
    </div>
  );
}
