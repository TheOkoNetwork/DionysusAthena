import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TicketProductsTable from "@/components/tables/ticket-products";
import Button from "@/components/ui/button/Button";

export const metadata: Metadata = {
  title: "Ticket Products | Dionysus Athena",
  description: "All ticket products configured in Dionysus",
};

export default function TicketProducts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ticket Products" />
      <div className="space-y-6">
        <ComponentCard title="">
          <Button size="sm" variant="primary" destinationUrl="/ticket-products/create">
            Create Ticket Product
          </Button>
          
          <TicketProductsTable />
        </ComponentCard>
      </div>
    </div>
  );
}