import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TicketTypesTable from "@/components/tables/ticket-types";
import Button from "@/components/ui/button/Button";

export const metadata: Metadata = {
  title: "Ticket Types | Dionysus Athena",
  description: "All ticket types configured in Dionysus",
};

export default function TicketTypes() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ticket Types" />
      <div className="space-y-6">
        <ComponentCard title="">
          <Button size="sm" variant="primary" destinationUrl="/ticket-types/create">
            Create Ticket Type
          </Button>
          
          <TicketTypesTable />
        </ComponentCard>
      </div>
    </div>
  );
}