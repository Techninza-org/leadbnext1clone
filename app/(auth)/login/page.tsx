import { LoginForm } from "@/components/User/Auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function LoginPage() {
  return (
    <Card className="bg-inherit max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-bold">Login</CardTitle>
        <CardDescription>Welcome Back!</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
