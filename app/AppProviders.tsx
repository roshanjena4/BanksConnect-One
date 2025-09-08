"use client";
import { ReduxProvider } from "./redux-provider";
// import { ThemeProvider } from "../components/theme-provider";
import { ThemeProvider } from "@/components/ui/theme-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
     <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
      <ReduxProvider>{children}</ReduxProvider>
    </ThemeProvider>
  );
}