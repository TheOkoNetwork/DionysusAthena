import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import StaffTable from "@/components/tables/staff";
import Button from "@/components/ui/button/Button";
export const metadata: Metadata = {
  title: "Staff | Dionysus Athena",
  description:
    "All staff members configured in Dionysus",
  // other metadata
};

export default function Customers() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Staff members" />
      <div className="space-y-6">
        <ComponentCard title="">
        <Button size="sm" variant="primary" destinationUrl="/staff/create">
              Create Staff member
            </Button>
          
          <StaffTable  />
        </ComponentCard>
      </div>
    </div>
  );
}
