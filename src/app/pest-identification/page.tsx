import { PageHeader } from "@/components/page-header";
import PestManager from "@/components/pest-management/pest-manager";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PestManagementPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Pest Management"
        description="Upload a photo of a potential pest to get an AI-powered identification and management advice."
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <PestManager />
      </Suspense>
    </div>
  );
}
