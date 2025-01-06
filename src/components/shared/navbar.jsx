"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter()
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: false 
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (

    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-center flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">InventiveLabs</span>
          </Link>
          
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex items-center space-x-2">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors hover:text-foreground/80 ${
                      pathname === item.href ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
              {status === 'loading' ? null : status === 'authenticated' && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email} - {session.user.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {session.user.role === 'ADMIN' && <Link href="/admin">Admin Dashboard</Link>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleSignOut()
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button> */}
                <Button asChild>
                  <Link href="/contact">Let's get started</Link>
                </Button>
              </>
            )}
            </div>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">InventiveLabs</span>
              </Link>
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg font-medium transition-colors hover:text-foreground/80 ${
                      pathname === item.href ? "text-foreground" : "text-foreground/60"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4">
                  { session?.user ?  (
                    
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="text-lg font-medium w-full justify-start"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      asChild
                      className="text-lg font-medium w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/contact">Let's get started!</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
//     <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container-center flex h-16 items-center">
//         <div className="mr-4 flex">
//           <Link href="/" className="mr-6 flex items-center space-x-2">
//             <span className="text-xl font-bold">InventiveLabs</span>
//           </Link>
          
//         </div>
//         <div className="hidden md:flex flex-1 items-center justify-end">
//           <div className="w-full flex-1 md:w-auto md:flex-none">
//             <div className="flex items-center space-x-4">
//               <nav className="flex items-center space-x-6 text-sm font-medium">
//                 {navigation.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`transition-colors hover:text-foreground/80 ${
//                       pathname === item.href ? "text-foreground" : "text-foreground/60"
//                     }`}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </nav>
//               <ThemeToggle />
//               {status === 'loading' ? null : status === 'authenticated' && session?.user ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="relative">
//                     <User className="h-5 w-5" />
//                     <span className="sr-only">User menu</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <div className="flex items-center justify-start gap-2 p-2">
//                     <div className="flex flex-col space-y-1 leading-none">
//                       {session.user.name && (
//                         <p className="font-medium">{session.user.name}</p>
//                       )}
//                       {session.user.email && (
//                         <p className="w-[200px] truncate text-sm text-muted-foreground">
//                           {session.user.email} - {session.user.role}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild>
//                     {session.user.role === 'ADMIN' && <Link href="/admin">Admin Dashboard</Link>}
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className="cursor-pointer"
//                     onSelect={(e) => {
//                       e.preventDefault()
//                       handleSignOut()
//                     }}
//                   >
//                     Sign Out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <>
//                 {/* <Button asChild variant="ghost">
//                   <Link href="/login">Sign In</Link>
//                 </Button> */}
//                 <Button asChild>
//                   <Link href="/login">Get Started</Link>
//                 </Button>
//               </>
//             )}
//             </div>
//           </div>
          
//           <Sheet open={isOpen} onOpenChange={setIsOpen}> 
//             <SheetTrigger asChild className="md:hidden">
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Toggle Menu</span>
//                 </Button>
              
//             </SheetTrigger>
//             <SheetContent side="left">
//               <Link href="/" className="flex items-center space-x-2">
//                 <span className="text-xl font-bold">InventiveLabs</span>
//               </Link>
//               <div className="mt-8 flex flex-col space-y-4">
//                 {navigation.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`text-lg font-medium transition-colors hover:text-foreground/80 ${
//                       pathname === item.href ? "text-foreground" : "text-foreground/60"
//                     }`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//                 <div className="pt-4">
//                   {session ? (
//                     <Button
//                       variant="ghost"
//                       onClick={() => {
//                         signOut();
//                         setIsOpen(false);
//                       }}
//                       className="text-lg font-medium w-full justify-start"
//                     >
//                       Sign Out
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="ghost"
//                       asChild
//                       className="text-lg font-medium w-full justify-start"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <Link href="/login">Sign In</Link>
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>
          
//         </div>
//       </div>
//     </nav>
//   );
// }
