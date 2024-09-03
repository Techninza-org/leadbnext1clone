import { CompaniesListTable } from "@/components/User/Admin/companies-list-table";
import { SettingsTable } from "@/components/User/Admin/settings-table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useModal } from "@/hooks/use-modal-store";
  
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