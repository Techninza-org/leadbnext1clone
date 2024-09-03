import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import { TransferedLeadsTable } from "@/components/User/Lead/transfered-leads-table";
  
  export default function TransferedLeadsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Transfered Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferedLeadsTable />
        </CardContent>
      </Card>
    );
  }
  