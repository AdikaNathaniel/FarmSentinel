import { PageHeader } from "@/components/page-header";
import AssistantChat from "@/components/assistant/assistant-chat";

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <PageHeader
        title="Ask Farm Assistant"
        description="Chat with an AI assistant to get information about your farm."
      />
      <div className="flex-grow">
        <AssistantChat />
      </div>
    </div>
  );
}
