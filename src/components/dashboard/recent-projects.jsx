"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const projects = [
  {
    name: "AI Chatbot",
    category: "Artificial Intelligence",
    date: "2024-01-15",
  },
  {
    name: "E-commerce Platform",
    category: "Web Development",
    date: "2024-01-10",
  },
  {
    name: "Mobile App",
    category: "Mobile Development",
    date: "2024-01-05",
  },
  {
    name: "Data Analytics Dashboard",
    category: "Data Science",
    date: "2024-01-01",
  },
]

export function RecentProjects() {
  return (
    <div className="space-y-8">
      {projects.map((project, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {project.name.split(" ").map(word => word[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{project.name}</p>
            <p className="text-sm text-muted-foreground">
              {project.category}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {new Date(project.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
