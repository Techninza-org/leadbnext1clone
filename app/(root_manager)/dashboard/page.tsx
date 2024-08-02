import { AnalysisCard } from "@/components/analysis-card";
import { BarGraph } from "@/components/Chats/bar-chats";
import { PieChart } from "@/components/Chats/pie-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <Card className="bg-inherit mx-auto">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" >
        <div className="lg:grid grid-cols-3 gap-3">
          <AnalysisCard />
          <AnalysisCard />
          <AnalysisCard />
        </div>
        <div className="lg:grid grid-cols-5 gap-3">
          <BarGraph className="col-span-3" />
          <PieChart className="col-span-2" />
        </div>
      </CardContent>
    </Card>
  );
}
