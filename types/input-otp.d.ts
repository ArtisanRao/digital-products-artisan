declare module "input-otp" {
  import * as React from "react";
  export const OTPInput: React.FC<React.HTMLAttributes<HTMLDivElement> & {
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    render?: (props: any) => React.ReactNode;
  }>;
  export const OTPInputContext: React.Context<any>;
}
