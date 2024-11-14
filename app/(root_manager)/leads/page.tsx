import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { LeadTable } from "@/components/Lead/lead-table";

export default function LeadsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <LeadTable />
      </CardContent>
    </Card>
  );
}
