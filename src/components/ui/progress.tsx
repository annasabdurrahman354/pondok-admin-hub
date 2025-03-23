
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressColor = "default" | "purple" | "blue" | "green" | "amber" | "pink";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: ProgressColor;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color = "default", ...props }, ref) => {
  // Color variant classes for the track
  const trackColorClasses = {
    default: "bg-secondary/50",
    purple: "bg-purple-100",
    blue: "bg-blue-100",
    green: "bg-green-100",
    amber: "bg-amber-100",
    pink: "bg-pink-100",
  };

  // Color variant classes for the indicator
  const indicatorColorClasses = {
    default: "bg-primary",
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
    pink: "bg-pink-500",
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full",
        trackColorClasses[color],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all rounded-full shadow-sm",
          indicatorColorClasses[color]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
