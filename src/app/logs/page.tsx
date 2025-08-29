import { PageHeader } from "@/components/page-header";
import LogsTable from "@/components/logs/logs-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Event Logs"
        description="Browse and filter through all system and node event logs."
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <LogsTable />
      </Suspense>
    </div>
  );
}
