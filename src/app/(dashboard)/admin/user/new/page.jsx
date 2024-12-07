"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/forms/user-form";

export default function NewUserPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/user")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">New User</h1>
      </div>

      <div className="max-w-2xl">
        <UserForm
          onSuccess={() => {
            router.push("/admin/user");
          }}
        />
      </div>
    </div>
  );
}
