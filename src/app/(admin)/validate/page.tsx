import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import BarcodeScannerComponent from "@/components/barcode/scanner"


export const metadata: Metadata = {
  title: "Validate | Dionysus Athena",
  description:
    "Ticket validation",
  // other metadata
};

export default function Validate() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ticket validation" />
      <div className="space-y-6">
        <ComponentCard title="">
          <BarcodeScannerComponent />
        </ComponentCard>
      </div>
    </div>
  );
}
