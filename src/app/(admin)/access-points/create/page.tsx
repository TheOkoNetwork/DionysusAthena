import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
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
                        <div className="space-y-6">
                            <div>
                                <Label>Name</Label>
                                <Input type="text" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Button>
                                    Create access point
                                    </Button>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
