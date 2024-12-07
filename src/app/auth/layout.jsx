import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({ children }) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <main className="container flex w-full flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
