import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#12263F] text-white hover:bg-[#0f1f33]",
      destructive: "bg-[#C0392B] text-white hover:bg-[#a83325]",
      outline: "border border-[#C9D1DC] bg-white text-[#12263F] hover:bg-[#F7F9FB]",
      secondary: "bg-[#F1F4F8] text-[#12263F] hover:bg-[#E8EDF3]",
      ghost: "hover:bg-[#F1F4F8] text-[#12263F]",
      link: "text-[#12263F] underline-offset-4 hover:underline",
      success: "bg-[#1E9E7A] text-white hover:bg-[#19866a]",
    }
    const sizes = {
      default: "h-9 px-4",
      sm: "h-8 px-3 text-[13px]",
      lg: "h-10 px-5",
      icon: "h-9 w-9",
    }
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12263F] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
