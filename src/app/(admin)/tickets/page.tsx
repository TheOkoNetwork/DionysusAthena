import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TicketsTable from "@/components/tables/tickets";

export const metadata: Metadata = {
  title: "Tickets | Dionysus Athena",
  description:
    "Search and view tickets in Dionysus",
  // other metadata
};

export default function Tickets() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tickets" />
      <div className="space-y-6">
        <ComponentCard title="Ticket Search">
          <TicketsTable />
        </ComponentCard>
      </div>
    </div>
  );
}