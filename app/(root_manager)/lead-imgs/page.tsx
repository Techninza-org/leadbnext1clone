import { LeadImagesTable } from "@/components/Company/lead-imgs-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function FollowupPage() {
  return (
    <Card className="bg-inherit mx-auto">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Exchanger Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" >
        <LeadImagesTable/>
      </CardContent>
    </Card>
  );
}
