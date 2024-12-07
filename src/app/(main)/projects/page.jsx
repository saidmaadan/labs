"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects?page=${currentPage}&limit=${projectsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.result?.projects || []);
        setTotalPosts(data.result?.total || 0);
        
        // Extract unique categories from projects
        const uniqueCategories = ["All", ...new Set(data.result?.projects.map(project => project.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]); // Add currentPage to dependency array

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search]);

  // Filter projects based on category and search
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = 
      !search ||
      (project.title && project.title.toLowerCase().includes(search.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate total pages based on whether we're filtering or not
  const totalPages = search || selectedCategory !== "All"
    ? Math.ceil(filteredProjects.length / projectsPerPage)
    : Math.ceil(totalPosts / projectsPerPage);

  // Get current projects to display
  const displayProjects = search || selectedCategory !== "All"
    ? filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)
    : projects;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="py-24 sm:py-32">
        <div className="container-center">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Our Projects
            </motion.h1>
            <motion.p
              className="mt-2 text-lg leading-8 text-foreground/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Discover our innovative solutions and success stories
            </motion.p>
          </div>

          <div className="mt-10 flex justify-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 sm:py-32">
        <div className="container-center">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Our Projects
            </motion.h1>
            <motion.p
              className="mt-2 text-lg leading-8 text-foreground/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Discover our innovative solutions and success stories
            </motion.p>
          </div>

          <div className="mt-10 flex justify-center">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Projects
          </motion.h1>
          <motion.p
            className="mt-2 text-lg leading-8 text-foreground/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Discover our innovative solutions and success stories
          </motion.p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search projects..."
              className="max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className={`mt-10 ${
            view === "grid" 
              ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid grid-cols-1 gap-10 xl:grid-cols-2"
          }`}>
          <AnimatePresence mode="wait">
            {displayProjects.length === 0 ? (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="col-span-full text-center py-8"
              >
                <p className="text-foreground/60">No projects found.</p>
              </motion.div>
            ) : (
              displayProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className={`group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-shadow hover:shadow-lg ${
                    view === "list" 
                      ? "flex flex-col sm:flex-row" 
                      : "flex flex-col"
                  }`}
                >
                  <div 
                    className={`relative ${
                      view === "list" 
                        ? "w-full sm:w-[280px] sm:min-w-[280px]" 
                        : "aspect-[16/9] w-full"
                    }`}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          view === "list" ? "aspect-video sm:aspect-auto" : ""
                        }`}
                      />
                    ) : (
                      <div className={`flex items-center justify-center bg-muted ${
                        view === "list" ? "aspect-video sm:h-full" : "h-full"
                      }`}>
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-col ${view === "list" ? "flex-1 p-6 sm:p-8" : "p-6"}`}>
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

                    <h3 className={`font-semibold leading-6 text-foreground ${
                      view === "list" ? "mt-3 text-xl sm:text-2xl" : "mt-4 text-xl"
                    }`}>
                      <span className="absolute inset-0" />
                      {project.title}
                    </h3>
                    <p className={`text-muted-foreground ${
                      view === "list" 
                        ? "mt-3 line-clamp-2 text-sm sm:mt-4 sm:text-base" 
                        : "mt-4 line-clamp-3 text-sm/relaxed"
                    }`}>
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && displayProjects.length > 0 && (
          <div className="mt-10 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
