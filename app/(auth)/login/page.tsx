import { LoginForm } from "@/components/User/Auth/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Button variant={'ghost'} size='sm' className="w-full mx-auto">
        <img src={'https://sooprs.com/images/sooprs_logo.png'} alt="logo" width={100} height={100} />
      </Button>
      <Card className="bg-inherit ">
        <CardHeader>
          <CardTitle className="font-bold">Login</CardTitle>
          <CardDescription>Welcome Back!</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        {/* <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-gray-700">
            Dont have an account?
            <Link href="/signup">
              <span className="text-blue-600"> Sign up</span>
            </Link>
          </p>
        </CardFooter> */}
      </Card>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full mx-auto" type="button">
        <Mail className="mr-2" />
        <span>Continue with Email</span>
      </Button> */}
    </div>
  );
}
