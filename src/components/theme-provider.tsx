import React from "react";
import { ThemeProvider } from "next-themes";

interface Props {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProviderWrapper({ children, defaultTheme, storageKey }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeProvider>
  );
}
