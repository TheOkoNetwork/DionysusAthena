import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import AccessPointsTable from "@/components/tables/access-points";
import Button from "@/components/ui/button/Button";
export const metadata: Metadata = {
  title: "Access Points | Dionysus Athena",
  description:
    "All access points configured in Dionysus",
  // other metadata
};

export default function AccessPoints() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Access Points" />
      <div className="space-y-6">
        <ComponentCard title="">
        <Button size="sm" variant="primary" destinationUrl="/access-points/create">
              Create Access Point
            </Button>
          
          <AccessPointsTable  />
        </ComponentCard>
      </div>
    </div>
  );
}
