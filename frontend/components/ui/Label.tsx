import * as React from "react";
import { Text, type TextProps } from "react-native";
import { cn } from "../../lib/utils";

const Label = React.forwardRef<Text, TextProps>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(
      "text-[12px] font-black uppercase tracking-widest text-primary/60 ml-1 mb-2",
      className
    )}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
