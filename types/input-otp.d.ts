"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

/** Narrow, explicit prop + ref types so we don't depend on input-otp exposing a ForwardRef type */
type InputOTPProps = React.HTMLAttributes<HTMLDivElement> & {
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
  render?: (props: any) => React.ReactNode
  containerClassName?: string
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref as any}
      className={cn("flex items-center gap-2", containerClassName)}
      inputMode="numeric"
      {...props}
    >
      <div className={cn("grid grid-cols-6 gap-2", className)}>{props.render?.({})}</div>
    </OTPInput>
  )
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
  )
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" aria-hidden className={cn("px-2 opacity-50", className)} {...props}>
      <Dot />
    </div>
  )
)
InputOTPSeparator.displayName = "InputOTPSeparator"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index?: number; hasFakeCaret?: boolean }
>(({ index, hasFakeCaret, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const char = inputOTPContext?.slots?.[index ?? 0]?.char ?? ""
  const isActive = inputOTPContext?.activeIndex === (index ?? 0)

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium",
        "bg-background ring-offset-background",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        isActive ? "border-ring" : "border-input",
        className
      )}
      {...props}
    >
      {char ? <span>{char}</span> : <span className="text-muted-foreground">•</span>}
      {isActive && hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      ) : null}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
