import { AssignMember } from "@/components/User/AssignMember/assign-member-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function DashboardPage() {
  return (
    <Card className="bg-inherit mx-auto">
      <CardHeader>
        <CardTitle className="font-bold">Assign Member!</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignMember />
      </CardContent>
    </Card>
  );
}
