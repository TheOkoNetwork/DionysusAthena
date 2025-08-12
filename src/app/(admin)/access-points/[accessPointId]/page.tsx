import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import AccessPointEditForm from "@/components/form/access-points/edit"
export const metadata: Metadata = {
  title: "Access Point | Dionysus Athena",
  description:
    "An access point configured in Dionysus",
  // other metadata
};

export default function AccessPoint({ params: { accessPointId } }: { params: { accessPointId: string } }) {
  return (
    <div>
      <PageBreadcrumb pageTitle="Access Point" />
      <div className="space-y-6">
        <ComponentCard title="">
          <AccessPointEditForm accessPointId={accessPointId} />
        </ComponentCard>
      </div>
    </div>
  );
}
