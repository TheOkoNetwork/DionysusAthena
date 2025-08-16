"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation'
import { ToastContainer } from 'react-toastify';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { status: sessionStatus } = useSession();

    if (sessionStatus === "loading") {
      return "Loading session..."
    }
    if (sessionStatus === "unauthenticated") {
      // If the user is not authenticated, redirect to the sign-in page
      return redirect('/signin')
    }
    // window.alert(JSON.stringify(session));
    // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        <ToastContainer  position="bottom-right" />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
