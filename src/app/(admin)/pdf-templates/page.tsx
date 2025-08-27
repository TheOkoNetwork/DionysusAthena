import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import PDFTemplatesTable from "@/components/tables/pdf-templates";
import Button from "@/components/ui/button/Button";
export const metadata: Metadata = {
  title: "PDF templates | Dionysus Athena",
  description:
    "All pdf templates configured in Dionysus",
  // other metadata
};

export default function PDFTemplates() {
  return (
    <div>
      <PageBreadcrumb pageTitle="PDF Templates" />
      <div className="space-y-6">
        <ComponentCard title="">
        <Button size="sm" variant="primary" destinationUrl="/pdf-templates/create">
              Create PDF template
            </Button>
          
          <PDFTemplatesTable  />
        </ComponentCard>
      </div>
    </div>
  );
}
