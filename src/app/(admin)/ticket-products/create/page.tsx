import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TicketProductCreateForm from "@/components/form/ticket-products/create";

export const metadata: Metadata = {
    title: "Create | Ticket Products | Dionysus Athena",
    description: "Ticket product creation page for Dionysus Athena",
};

export default function CreateTicketProduct() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Ticket Product" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="">
                        <TicketProductCreateForm/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}