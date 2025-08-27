import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import PDFMeDesigner from "@/components/pdfme/designer";
export const metadata: Metadata = {
  title: "Create | PDF template | Dionysus Athena",
  description:
    "PDF template Creation for Dionysus",
  // other metadata
};


export default async function PDFTemplate() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create a PDF Template" />
      <div className="space-y-6">
        <ComponentCard title="">
          <PDFMeDesigner />
        </ComponentCard>
      </div>
    </div>
  );
}