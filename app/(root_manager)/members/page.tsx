import { MemberTable } from "@/components/Table/member"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function MemberPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold">Members</CardTitle>
            </CardHeader>
            <CardContent>
                <MemberTable />
            </CardContent>
        </Card>
    )
}