"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from '@/context/SidebarContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </SessionProvider>
  );
}
