'use client';

import { Toaster } from '@components/ui/sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

/**
 * Providers component to wrap the entire application with global providers and guards.
 * Includes theme provider, analytics provider, toaster component, and authentication guard.
 *
 * @param children - React children components to render within the providers.
 * @returns JSX.Element
 */
export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster position="top-right" richColors />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
};
