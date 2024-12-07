"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/forms/project-form";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/project")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">New Project</h1>
      </div>

      <div className="max-w-2xl">
        <ProjectForm
          onSuccess={() => {
            toast.success("Project created successfully");
            router.push("/admin/project");
          }}
        />
      </div>
    </div>
  );
}
