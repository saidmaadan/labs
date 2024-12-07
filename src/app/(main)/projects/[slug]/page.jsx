import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Github, Calendar } from "lucide-react";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

async function getProject(slug) {
  const project = await prisma.project.findUnique({
    where: {
      slug,
      published: true,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

async function getRecentProjects(currentSlug) {
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      slug: {
        not: currentSlug, // Exclude current project
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 3,
    include: {
      technologies: true,
    },
  });

  return projects;
}

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  const recentProjects = await getRecentProjects(params.slug);

  return (
    <div className="py-24 sm:py-32">
      <div className="container-center">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
          {/* Main Content - 2/3 width */}
          <div className="xl:col-span-2">
            <div className="space-y-8">
              {/* Project Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {project.category || "Uncategorized"}
                  </span>
                  {project.status && (
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      project.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      project.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {project.status.replace("_", " ")}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
                {project.publishedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={project.publishedAt}>
                      {format(new Date(project.publishedAt), 'MMMM d, yyyy')}
                    </time>
                  </div>
                )}
              </div>

              {/* Project Image */}
              {project.image && (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full min-h-[300px] max-h-[300px]"
                  />
                </div>
              )}

              {/* Project Description */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground">{project.description}</p>
                <div className="mt-8" dangerouslySetInnerHTML={{ __html: project.content }} />
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Links */}
              <div className="flex flex-wrap gap-4">
                {project.demoUrl && (
                  <Button asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Recent Projects Sidebar - 1/3 width */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <div className="space-y-4">
              {recentProjects.map((recent) => (
                <Card key={recent.id} className="overflow-hidden">
                  <a href={`/projects/${recent.slug}`} className="group block">
                    {recent.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={recent.image}
                          alt={recent.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary">
                        {recent.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {recent.description}
                      </p>
                      {recent.technologies && recent.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {recent.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
