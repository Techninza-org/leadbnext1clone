import { SettingsTable } from "@/components/User/Admin/settings-table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  export default function SettingsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Settings</CardTitle>
        </CardHeader>
        <CardContent>
            <SettingsTable />
        </CardContent>
      </Card>
    );
  }