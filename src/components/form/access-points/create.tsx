'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


export default function AccessPointCreateForm() {
  const [accessPointName, setAccessPointName] = useState('');
  const router = useRouter();

  const handleCreateAccessPoint = async () => {
    if (!accessPointName.trim()) {
      toast.error("Access Point Name cannot be empty.");
      return;
    }

    try {
      const response = await fetch('/api/request/CreateAccessPoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: accessPointName }),
      });

      const result = await response.json();

      if (response.status && result.id) {
        toast.success("Access Point created successfully!");
        router.push(`/access-points/${result.id}`);
      } else {
        toast.error(result.error || "Failed to create Access Point.");
      }
    } catch (error) {
      console.error("Error creating access point:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
 <div className="space-y-6">
 <div>
 <Label>Name</Label>
 <Input type="text" onChange={(e) => setAccessPointName(e.target.value)} />
 </div>
 </div>
 <div className="flex justify-end mt-6">
 <Button onClick={handleCreateAccessPoint}>
            Create access point
 </Button>
      </div>
    </>
  )
}
