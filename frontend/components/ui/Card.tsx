import * as React from "react";
import { View, Text, type ViewProps } from "react-native";
import { cn } from "../../lib/utils";

const Card = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "rounded-3xl border border-primary/5 bg-white shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, any>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("text-2xl font-black leading-none tracking-tight text-primary", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, any>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn("text-sm font-bold text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
