
"use client";

import * as React from "react";
import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { InputOtpProps, InputOtpRootProps } from "@/types/input-otp-types";

interface InputOtpSlotProps extends React.ComponentPropsWithoutRef<"div"> {
  char: string | null;
  hasFakeCaret: boolean;
  isActive: boolean;
  className?: string;
}

const InputOtpSlot = React.forwardRef<HTMLDivElement, InputOtpSlotProps>(
  ({ char, hasFakeCaret, isActive, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret h-4 w-px bg-foreground" />
        </div>
      )}
    </div>
  )
);

InputOtpSlot.displayName = "InputOtpSlot";

interface InputOtpGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  // Add custom props if needed
}

const InputOtpGroup = React.forwardRef<HTMLDivElement, InputOtpGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
);

InputOtpGroup.displayName = "InputOtpGroup";

// Use InputOtpProps from the type definition
const InputOtp = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOtpProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2", className)}
      {...rest}
    />
  );
});

InputOtp.displayName = "InputOtp";

// Use InputOtpRootProps from the type definition
const InputOtpRoot = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOtpRootProps>((props, ref) => {
  const { className, containerClassName, ...rest } = props;
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2", containerClassName)}
      className={className}
      render={({ slots = [] }) => (
        <InputOtpGroup>
          {slots.map((slot: SlotProps, index: number) => (
            <InputOtpSlot key={index} {...slot} />
          ))}
        </InputOtpGroup>
      )}
      {...rest}
    />
  );
});

InputOtpRoot.displayName = "InputOtpRoot";

interface InputOtpSkeletonProps extends React.ComponentProps<typeof Skeleton> {
  digits?: number;
}

const InputOtpSkeleton = ({ digits = 6, className, ...props }: InputOtpSkeletonProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: digits }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-10 w-10 rounded-md", className)}
          {...props}
        />
      ))}
    </div>
  );
};

export {
  InputOtp,
  InputOtpRoot,
  InputOtpGroup,
  InputOtpSlot,
  InputOtpSkeleton,
};
