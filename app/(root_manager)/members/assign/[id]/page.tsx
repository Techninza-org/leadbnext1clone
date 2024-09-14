import { AssignMember } from "@/components/User/AssignMember/assign-member-form";
import { CreateUpdateCompanyMenager } from "@/components/User/AssignMember/create-update-company-manager-form";
import { UpdateMember } from "@/components/User/AssignMember/update-member";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function AssignMemberPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <Card className="bg-inherit mx-auto">
        <CardHeader>
          <CardTitle className="font-bold">Update Member!</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateMember userId={params.id} />
        </CardContent>
      </Card>
      {/* <Card className="bg-inherit mx-auto">
        <CardHeader>
          <CardTitle className="font-bold">Update Manager!</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUpdateCompanyMenager />
        </CardContent>
      </Card> */}
    </div>
  );
}
