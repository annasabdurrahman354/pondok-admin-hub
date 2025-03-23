
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

type RadioColor = "default" | "purple" | "blue" | "green" | "amber" | "pink";

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  color?: RadioColor;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, color = "default", ...props }, ref) => {
  // Color variant classes
  const colorClasses = {
    default: "border-primary text-primary",
    purple: "border-purple-500 text-purple-500",
    blue: "border-blue-500 text-blue-500",
    green: "border-green-500 text-green-500",
    amber: "border-amber-500 text-amber-500",
    pink: "border-pink-500 text-pink-500",
  };

  // Hover color classes
  const hoverClasses = {
    default: "hover:border-primary/80",
    purple: "hover:border-purple-400",
    blue: "hover:border-blue-400",
    green: "hover:border-green-400",
    amber: "hover:border-amber-400",
    pink: "hover:border-pink-400",
  };

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-6 w-6 rounded-full border-2 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:scale-105",
        colorClasses[color],
        hoverClasses[color],
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-current text-current animate-in zoom-in-50 duration-300" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
