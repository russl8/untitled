"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { EyeClosed, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const EyeCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "text-sidebar-foreground/40",
      className,
      { "text-sidebar-foreground/70": props.checked }
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >

    </CheckboxPrimitive.Indicator>
      {props.checked ?
        <Eye className="h-5"/>
        :
        <EyeClosed  className="h-5"/>
      }
  </CheckboxPrimitive.Root>
))
EyeCheckbox.displayName = CheckboxPrimitive.Root.displayName

export { EyeCheckbox }
