import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import CustomerEditForm from "@/components/form/customers/edit"
export const metadata: Metadata = {
  title: "Customer | Dionysus Athena",
  description:
    "A customer configured in Dionysus",
  // other metadata
};

export default async function Customer({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const { customerId } = await params;
  return (
    <div>
      <PageBreadcrumb pageTitle="Customer" />
      <div className="space-y-6">
        <ComponentCard title="">
          <CustomerEditForm customerId={customerId} />
        </ComponentCard>
      </div>
    </div>
  );
}