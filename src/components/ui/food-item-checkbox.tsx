
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FoodItemCheckboxProps extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
  className?: string;
}

const FoodItemCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  FoodItemCheckboxProps
>(({ checked = false, onChange, label, className, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        ref={ref}
        checked={checked}
        onCheckedChange={() => onChange?.()}
        className={cn("h-4 w-4", className)}
        {...props}
      />
      {label && (
        <label
          className={cn(
            "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            checked && "line-through text-muted-foreground"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
});

FoodItemCheckbox.displayName = "FoodItemCheckbox";

export { FoodItemCheckbox };
