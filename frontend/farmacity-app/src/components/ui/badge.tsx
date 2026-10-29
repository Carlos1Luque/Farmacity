import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#12263F] text-white",
    secondary: "bg-gray-100 text-[#5B6B7C]",
    destructive: "bg-[#C0392B] text-white",
    outline: "border border-[#D8DEE6] text-[#12263F]",
    success: "bg-[#1E9E7A] text-white",
    warning: "bg-[#E0A100] text-white",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
