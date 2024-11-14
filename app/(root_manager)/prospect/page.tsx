import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import { ProspectTable } from "@/components/Lead/prospect-table";
  
  export default function ProspectsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Prospects</CardTitle>
        </CardHeader>
        <CardContent>
          <ProspectTable />
        </CardContent>
      </Card>
    );
  }
  