import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressEnhancedProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  status?: 'completed' | 'on-track' | 'near-target' | 'at-risk'
  showGlow?: boolean
}

const ProgressEnhanced = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressEnhancedProps
>(({ className, value, status = 'at-risk', showGlow = false, ...props }, ref) => {
  const getStatusColors = () => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-goal-completed-bg',
          fill: 'bg-goal-completed',
          glow: showGlow ? 'shadow-lg shadow-goal-completed/30' : ''
        }
      case 'on-track':
        return {
          bg: 'bg-goal-on-track-bg',
          fill: 'bg-goal-on-track',
          glow: showGlow ? 'shadow-lg shadow-goal-on-track/30' : ''
        }
      case 'near-target':
        return {
          bg: 'bg-goal-near-target-bg',
          fill: 'bg-goal-near-target',
          glow: showGlow ? 'shadow-lg shadow-goal-near-target/30' : ''
        }
      case 'at-risk':
        return {
          bg: 'bg-goal-at-risk-bg',
          fill: 'bg-goal-at-risk',
          glow: showGlow ? 'shadow-lg shadow-goal-at-risk/30' : ''
        }
      default:
        return {
          bg: 'bg-secondary',
          fill: 'bg-primary',
          glow: ''
        }
    }
  }

  const colors = getStatusColors()

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full",
        colors.bg,
        colors.glow,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-out",
          colors.fill
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
ProgressEnhanced.displayName = "ProgressEnhanced"

export { ProgressEnhanced }