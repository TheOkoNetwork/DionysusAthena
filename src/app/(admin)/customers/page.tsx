import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import CustomersTable from "@/components/tables/customers";
import Button from "@/components/ui/button/Button";
export const metadata: Metadata = {
  title: "Customers | Dionysus Athena",
  description:
    "All customers configured in Dionysus",
  // other metadata
};

export default function Customers() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Customers" />
      <div className="space-y-6">
        <ComponentCard title="">
        <Button size="sm" variant="primary" destinationUrl="/customers/create">
              Create Customer
            </Button>
          
          <CustomersTable  />
        </ComponentCard>
      </div>
    </div>
  );
}
