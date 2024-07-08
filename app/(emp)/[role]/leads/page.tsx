import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AssignedLeadTable } from "@/components/User/Lead/assigned-lead-table";

export default function LeadsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignedLeadTable />
      </CardContent>
    </Card>
  );
}
