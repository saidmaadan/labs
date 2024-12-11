import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/auth/signin-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="w-full grid md:grid-cols-2 min-h-screen">
      {/* Left Column - Hidden on medium screens */}
      <div className="hidden md:flex flex-col bg-[#0a1c22] text-white p-10 justify-between">
        <div className=""></div>
        <div className="space-y-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Your fullstack product development team.</h1>
          <p>@InventiveLabs, we build awesome mobile and web apps</p>
        </div>
        <p className="text-sm">Made with love in Austin TX.</p>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full flex items-center justify-center p-8 ">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">Welcome Back...</h1>
          </div>
          <SignInForm />
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
