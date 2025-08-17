import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import StaffEditForm from "@/components/form/staff/edit"
export const metadata: Metadata = {
  title: "Staff | Dionysus Athena",
  description:
    "A Staff member configured in Dionysus",
  // other metadata
};

export default async function Customer({
  params,
}: {
  params: Promise<{ staffId: string }>
}) {
  const { staffId } = await params;
  return (
    <div>
      <PageBreadcrumb pageTitle="Staff member" />
      <div className="space-y-6">
        <ComponentCard title="">
          <StaffEditForm staffId={staffId} />
        </ComponentCard>
      </div>
    </div>
  );
}