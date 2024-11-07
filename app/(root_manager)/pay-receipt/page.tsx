import { PaymentTable } from "@/components/Company/payment-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function FollowupPage() {
  return (
    <Card className="bg-inherit mx-auto">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" >
        <PaymentTable/>
      </CardContent>
    </Card>
  );
}
