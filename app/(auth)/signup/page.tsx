import { SignupForm } from "@/components/User/Auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
    <Card className="bg-inherit">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Welcome to our Lead Managment App!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
