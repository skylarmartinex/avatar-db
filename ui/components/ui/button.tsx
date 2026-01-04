import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glass"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const variants = {
            default: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all",
            destructive: "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-900/20",
            outline: "border border-white/10 bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white transition-all",
            secondary: "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-white/5",
            ghost: "hover:bg-white/5 text-zinc-500 hover:text-zinc-200 transition-colors",
            link: "text-blue-500 underline-offset-4 hover:underline",
            glass: "bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md text-white transition-all",
        }

        const sizes = {
            default: "h-11 px-5 py-2.5",
            sm: "h-9 rounded-lg px-4 text-xs font-bold",
            lg: "h-14 rounded-2xl px-10 text-base font-bold tracking-tight",
            icon: "h-11 w-11",
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
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
