"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadProjects(page = 1) {
    try {
      const response = await fetch(`/api/projects?page=${page}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to load projects");
      
      setProjects(data.result?.projects || []);
      setTotalPages(data.result?.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      toast.error(error.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to delete project");

      toast.success("Project deleted successfully");
      loadProjects(currentPage);
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={() => router.push("/admin/project/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="text-center py-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => router.push("/admin/project/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(projects) && projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.featured ? "Yes" : "No"}</TableCell>
                <TableCell>{project.published ? "Yes" : "No"}</TableCell>
                <TableCell>{formatDate(project.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/project/${project.slug}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.slug)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!Array.isArray(projects) || projects.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => loadProjects(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
