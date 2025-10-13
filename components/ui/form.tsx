"use client"

import * as React from "react"
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/* ---------- Form root (re-export RHF provider) ---------- */

const Form = FormProvider

/* ---------- Field context ---------- */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(
  undefined
)

export function useFormField() {
  const ctx = React.useContext(FormFieldContext)
  if (!ctx) {
    throw new Error("useFormField must be used within <FormField>")
  }
  return ctx
}

/* ---------- Item / Control / Label / Description / Message ---------- */

type FormItemContextValue = { id: string }
const FormItemContext = React.createContext<FormItemContextValue | undefined>(
  undefined
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const item = React.useContext(FormItemContext)
  return (
    <Label
      ref={ref}
      className={className}
      htmlFor={item?.id}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const item = React.useContext(FormItemContext)
  return (
    <div
      ref={ref}
      className={cn(className)}
      aria-describedby={item ? `${item.id}-description ${item.id}-message` : undefined}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const item = React.useContext(FormItemContext)
  return (
    <p
      ref={ref}
      id={item?.id ? `${item.id}-description` : undefined}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const item = React.useContext(FormItemContext)
  return (
    <p
      ref={ref}
      id={item?.id ? `${item.id}-message` : undefined}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  )
})
FormMessage.displayName = "FormMessage"

/* ---------- FormField (typed without ControllerProps) ---------- */

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
  render: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactNode
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ name, render }: FormFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name as FieldPath<TFieldValues>}
        control={control}
        render={({ field }) => <FormItem>{render({ field })}</FormItem>}
      />
    </FormFieldContext.Provider>
  )
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
