import { ApprovedLeadTable } from "@/components/Lead/approved-lead-table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  export default function TransferedLeadsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovedLeadTable />
        </CardContent>
      </Card>
    );
  }
  