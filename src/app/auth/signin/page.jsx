import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/auth/signin-form";
import { Shell } from "@/components/shells/shell";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <Shell className="max-w-lg my-auto mt-20 md:mt-30">
      <div className="flex flex-col space-y-4 text-center">
        <div className="space-y-2">
          <Link href="/">
          <h1 className="text-3xl font-bold ">InventiveLabs</h1>
          </Link>
          <h1 className="text-lg ">Welcome back</h1>
          <p className="text-muted-foreground">
            Choose your preferred sign in method
          </p>
        </div>
        <SignInForm />
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </Shell>
  );
}
