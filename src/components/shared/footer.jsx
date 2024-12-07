"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterSubscribe } from "@/components/newsletter/newsletter-subscribe";
import { Github, Twitter, Linkedin } from "lucide-react";

const socialLinks = [
  {
    title: "Twitter",
    href: "https://twitter.com",
    icon: <Twitter className="h-4 w-4" />,
  },
  {
    title: "GitHub",
    href: "https://github.com",
    icon: <Github className="h-4 w-4" />,
  },
  {
    title: "LinkedIn",
    href: "https://linkedin.com",
    icon: <Linkedin className="h-4 w-4" />,
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container-center space-y-8 mt-20 ">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pb-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">InventiveLabs</h2>
            <p className="text-muted-foreground max-w-xs">
              Innovative solutions for modern software development and AI integration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Newsletter</h3>
              <p className="text-muted-foreground text-sm">
                Subscribe to our newsletter for updates, articles, and exclusive content.
              </p>
              <NewsletterSubscribe className="max-w-sm" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 pb-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} InventiveLabs. All rights
            reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                asChild
              >
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.icon}
                  <span className="sr-only">{link.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
