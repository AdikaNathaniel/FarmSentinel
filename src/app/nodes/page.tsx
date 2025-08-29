import { PageHeader } from "@/components/page-header";
import NodesTable from "@/components/nodes/nodes-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NodesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Node Management"
        description="Monitor and interact with all the scarecrow nodes on your farm."
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <NodesTable />
      </Suspense>
    </div>
  );
}
