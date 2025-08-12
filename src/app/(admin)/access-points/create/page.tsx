import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AccessPointCreateForm from "@/components/form/access-points/create"
export const metadata: Metadata = {
    title: "Create | Access Points | Dionysus Athena",
    description:
        "Access point creation page for Dionysus Athena",
};

export default function FormElements() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create access point" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="space-y-6">
                    <ComponentCard title="">
                        <AccessPointCreateForm/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
