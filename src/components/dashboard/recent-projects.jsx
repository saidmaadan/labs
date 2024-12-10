"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  // const [projects, setProjects] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchProjects();
  // }, []);
  
  // const fetchProjects = async () => {
  //     try {
  //       const response = await fetch("/api/projects?limit=8");
  //       const data = await response.json();
  //       if (data.success) {
  //         setProjects(data.result);
  //       } else {
  //         toast.error(data.error || "Failed to fetch projects");
  //       }
  //     }catch (error) {
  //         toast.error("Failed to fetch projects");
  //       } finally {
  //         setLoading(false);
  //       }
  // };
    
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
