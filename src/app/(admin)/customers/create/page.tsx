import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CustomerCreateForm from "@/components/form/customers/create"
export const metadata: Metadata = {
    title: "Create | Customers | Dionysus Athena",
    description:
        "Customer creation page for Dionysus Athena",
};

export default function FormElements() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create customer" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="">
                        <CustomerCreateForm/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
