import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import StaffCreateForm from "@/components/form/staff/create"
export const metadata: Metadata = {
    title: "Create | Staff | Dionysus Athena",
    description:
        "Staff creation page for Dionysus Athena",
};

export default function FormElements() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Staff member" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="">
                        <StaffCreateForm/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
