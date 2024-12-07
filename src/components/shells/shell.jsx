import { cn } from "@/lib/utils";

export function Shell({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "grid items-center justify-center gap-6 pb-8 pt-6 md:py-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
