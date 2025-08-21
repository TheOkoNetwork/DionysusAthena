import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TicketProductTypesTable from "@/components/tables/ticket-product-types";
import Button from "@/components/ui/button/Button";

export const metadata: Metadata = {
  title: "Ticket Product Types | Dionysus Athena",
  description: "All ticket product types configured in Dionysus",
};

export default function TicketProductTypes() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ticket Product Types" />
      <div className="space-y-6">
        <ComponentCard title="">
          <Button size="sm" variant="primary" destinationUrl="/ticket-product-types/create">
            Create Ticket Product Type
          </Button>
          
          <TicketProductTypesTable />
        </ComponentCard>
      </div>
    </div>
  );
}