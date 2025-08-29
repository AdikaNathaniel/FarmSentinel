import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockNodes } from "@/lib/mock-data";
import { HardDrive, CheckCircle, XCircle, BatteryWarning } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HealthCards() {
  const totalNodes = mockNodes.length;
  const activeNodes = mockNodes.filter(n => n.status === 'active').length;
  const offlineNodes = totalNodes - activeNodes;
  const lowBatteryNodes = mockNodes.filter(n => n.battery < 20).length;

  const stats = [
    { title: "Total Nodes", value: totalNodes, icon: HardDrive, color: "text-accent", borderColor: "border-l-accent", href: "/nodes" },
    { title: "Active Nodes", value: activeNodes, icon: CheckCircle, color: "text-primary", borderColor: "border-l-primary", href: "/nodes" },
    { title: "Offline Nodes", value: offlineNodes, icon: XCircle, color: "text-destructive", borderColor: "border-l-destructive", href: "/nodes" },
    { title: "Low Battery", value: lowBatteryNodes, icon: BatteryWarning, color: "text-chart-3", borderColor: "border-l-chart-3", href: "/nodes" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link href={stat.href} key={stat.title} className="block">
          <Card className={cn("transition-all hover:shadow-lg hover:-translate-y-1 h-full border-l-4", stat.borderColor)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={cn("h-4 w-4 text-muted-foreground", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
