import { AssignMember } from "@/components/User/AssignMember/assign-member-form";
import { CreateUpdateCompanyMenager } from "@/components/User/AssignMember/create-update-company-manager-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Card className="bg-inherit mx-auto">
        <CardHeader>
          <CardTitle className="font-bold">Assign Member!</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignMember />
        </CardContent>
      </Card>
      <Card className="bg-inherit mx-auto">
        <CardHeader>
          <CardTitle className="font-bold">Update Manager!</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUpdateCompanyMenager />
        </CardContent>
      </Card>
    </div>
  );
}
