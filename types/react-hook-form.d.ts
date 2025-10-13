declare module "react-hook-form" {
  import * as React from "react";
  // super-minimal types—good enough to compile
  export type FieldValues = Record<string, any>;
  export type SubmitHandler<TFieldValues extends FieldValues = FieldValues> = (data: TFieldValues) => any;

  export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): any;
  export const FormProvider: React.ComponentType<any>;
  export const Controller: React.ComponentType<any>;
  export function useForm<TFieldValues extends FieldValues = FieldValues>(...args: any[]): any;
}
