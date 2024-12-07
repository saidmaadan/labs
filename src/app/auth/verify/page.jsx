import { Shell } from "@/components/shells/shell";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address to sign in",
};

export default function VerifyRequestPage() {
  return (
    <Shell className="max-w-lg">
      <div className="flex flex-col space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            A sign in link has been sent to your email address.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            If you don&apos;t see the email, check your spam folder.
          </p>
          <p className="text-sm text-muted-foreground">
            The link will expire in 24 hours.
          </p>
        </div>
      </div>
    </Shell>
  );
}
