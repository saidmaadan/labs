"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  User,
  FileText,
  Folder,
  Tag,
  Mail,
  LogOut,
  Menu,
  Microchip,
  ChartBarStacked,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Technologies",
    href: "/admin/technology",
    icon: Microchip,
  },
  {
    title: "Tags",
    href: "/admin/tag",
    icon: Tag,
  },
  {
    title: "Projects",
    href: "/admin/project",
    icon: Folder,
  },
  {
    title: "Categories",
    href: "/admin/category",
    icon: ChartBarStacked,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Settings",
    href: "/admin/user",
    icon: Settings,
  },
]

function DashboardLayoutContent({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
        } else {
          router.push("/auth/signin");
        }
      } catch (error) {
        toast.error("Failed to load user session");
        router.push("/auth/signin");
      }
    }

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/signin");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={cn(
        "relative hidden border-r bg-background lg:block",
        isCollapsed ? "w-[80px]" : "w-[240px]",
        "transition-width duration-200 ease-in-out"
      )}>
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center justify-between border-b px-6">
            <Link 
              href="/" 
              className={cn("flex items-center gap-2 font-bold", 
                isCollapsed && "hidden"
              )}
            >
              <span className="text-xl">InventiveLabs</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {sidebarNavItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent" : "transparent",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
          {user && (
            <div className="mt-auto p-4 border-t">
              <div className={cn(
                "flex items-center gap-3 mb-2",
                isCollapsed && "flex-col"
              )}>
                <Avatar className="h-8 w-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                )}
              </div>
              <Button 
                className={cn("w-full", isCollapsed && "px-2")} 
                variant="outline"
                size={isCollapsed ? "icon" : "default"}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center gap-4">
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <Avatar className="h-8 w-8">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ThemeProvider>
  )
}
