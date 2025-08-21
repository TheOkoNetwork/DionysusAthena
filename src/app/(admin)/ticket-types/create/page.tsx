import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TicketTypeCreateForm from "@/components/form/ticket-types/create";

export const metadata: Metadata = {
    title: "Create | Ticket Types | Dionysus Athena",
    description: "Ticket type creation page for Dionysus Athena",
};

export default function CreateTicketType() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Ticket Type" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="">
                        <TicketTypeCreateForm/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}