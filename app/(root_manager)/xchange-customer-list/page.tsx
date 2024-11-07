import { ExchangeCustomerTable } from "@/components/Company/exchange/customer/customer-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ExchangeCustomerPage() {
  return (
    <Card className="bg-inherit mx-auto">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Exchange Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" >
        <ExchangeCustomerTable/>
      </CardContent>
    </Card>
  );
}
