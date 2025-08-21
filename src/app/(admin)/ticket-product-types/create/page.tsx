import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TicketProductTypeCreateForm from "@/components/form/ticket-product-types/create";

export const metadata: Metadata = {
    title: "Create | Ticket Product Types | Dionysus Athena",
    description: "Ticket product type creation page for Dionysus Athena",
};

export default function CreateTicketProductType() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Ticket Product Type" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="">
                        <TicketProductTypeCreateForm/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}