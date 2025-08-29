import { PageHeader } from "@/components/page-header";
import AlertsTable from "@/components/alerts/alerts-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Alerts"
        description="Review and filter all bird detection alerts from your nodes."
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <AlertsTable />
      </Suspense>
    </div>
  );
}
