"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ url, title }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#4267B2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0077b5]",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied!, The article link has been copied to your clipboard.");
      // toast({
      //   title: "Link copied!",
      //   description: "The article link has been copied to your clipboard.",
      // });
      setIsTooltipOpen(false);
    } catch (err) {
      toast("Failed to copy, Please try again or copy the URL manually.");
      // toast({
      //   title: "Failed to copy",
      //   description: "Please try again or copy the URL manually.",
      //   variant: "destructive",
      // });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 className="h-4 w-4" /> Share
      </span>
      {shareLinks.map((platform) => (
        <TooltipProvider key={platform.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(platform.url, "_blank")}
              >
                <platform.icon className={`h-4 w-4 ${platform.color}`} />
                <span className="sr-only">Share on {platform.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on {platform.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <TooltipProvider>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyToClipboard}
            >
              <LinkIcon className="h-4 w-4 hover:text-primary" />
              <span className="sr-only">Copy link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
