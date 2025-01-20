import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AssignedProspectTable } from "@/components/User/Lead/assigned-prospect-table";

export default function ProspectsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignedProspectTable />
      </CardContent>
    </Card>
  );
}
