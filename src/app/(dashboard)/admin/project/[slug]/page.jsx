"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/forms/project-form";

export default function EditProjectPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(params?.slug || null);

  useEffect(() => {
    if (!slug) {
      router.push("/admin/project");
      return;
    }

    async function loadProject() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${slug}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load project");
        }

        setProject(data.result);
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error(error.message);
        router.push("/admin/project");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => router.push("/admin/project")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => router.push("/admin/project")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Project not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/project")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          Edit Project: {project.title}
        </h1>
      </div>

      <div className="max-w-2xl">
        <ProjectForm
          project={project}
          onSuccess={() => {
            toast.success("Project updated successfully");
            router.push("/admin/project");
          }}
        />
      </div>
    </div>
  );
}
