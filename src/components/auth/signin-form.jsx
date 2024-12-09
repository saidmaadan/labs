"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignInForm() {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="grid gap-6 items-center mt-20 my-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account with your favorite provider
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-6">
            <Button
              variant="outline"
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
              Github
            </Button>
            <Button
              variant="outline"
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
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
