import { SignupForm } from "@/components/User/Auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";


export default function SignupPage() {
  return (
    <Card className="max-w-screen-lg mx-auto bg-inherit ">
      <CardHeader>
        <CardTitle className="font-bold">Signup</CardTitle>
        <CardDescription>Welcome!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter>
        <div className="text-center mx-auto space-x-2">
          <p className="mt-2 text-xs text-center text-gray-700">Already have an account?
            <Link href="/auth/login" className="text-blue-600 ml-1">
              Login
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
