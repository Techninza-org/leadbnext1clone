import { SignupForm } from "@/components/User/Auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function SignupPage() {
  return (
    <Card className="bg-inherit max-w-screen-lg">
      <CardHeader>
        <CardTitle className="font-bold">Signup</CardTitle>
        <CardDescription>Welcome to our Lead Managment App!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
