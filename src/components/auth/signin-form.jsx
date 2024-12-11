"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Link } from "next/link";
import {toast} from "sonner";

export function SignInForm() {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={async () => {
            setIsGitHubLoading(true);
            try {
              await signIn("github", { callbackUrl });
            } catch (error) {
              toast.error("Something went wrong. Please try again.");
            } finally {
              setIsGitHubLoading(false);
            }
          }}
          disabled={isGitHubLoading}
        >
          {isGitHubLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          Sign in with GitHub
        </Button>

        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={async () => {
            setIsGoogleLoading(true);
            try {
              await signIn("google", { callbackUrl });
            } catch (error) {
              toast.error("Something went wrong. Please try again.");
            } finally {
              setIsGoogleLoading(false);
            }
          }}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.chrome className="mr-2 h-4 w-4" />
          )}{" "}
          Sign in with Google
        </Button>
      </div>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <Button className="w-full">Sign in</Button>
        <div className="text-sm text-center">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Forgot password?
          </Link>
        </div>
      </div> */}
    </div>
  );
}
