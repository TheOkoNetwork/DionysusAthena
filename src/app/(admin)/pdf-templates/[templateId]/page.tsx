import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import PDFMeDesigner from "@/components/pdfme/designer";
export const metadata: Metadata = {
  title: "PDF template | Dionysus Athena",
  description:
    "A PDF template configured in Dionysus",
  // other metadata
};


export default async function PDFTemplate({
  params,
}: {
  params: Promise<{ templateId: string }>
}) {
  const { templateId } = await params;
  return (
    <div>
      <PageBreadcrumb pageTitle="PDF Template" />
      <div className="space-y-6">
        <ComponentCard title="">
          <PDFMeDesigner templateId={templateId} />
        </ComponentCard>
      </div>
    </div>
  );
}