'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState, useEffect } from "react";
import { useRouter, redirect } from 'next/navigation';
import { toast } from 'react-toastify';

interface AccessPointEditFormProps {
  accessPointId: string;
}

export default function AccessPointEditForm({ accessPointId }: AccessPointEditFormProps) {
  const [accessPointName, setAccessPointName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAccessPoint = async () => {
      try {
        const response = await fetch(`/api/request/GetAccessPoint/${accessPointId}`);
        const data = await response.json();

        if (response.ok && data && data.name) {
          setAccessPointName(data.name);
        } else {
          toast.error(`Access point with ID ${accessPointId} not found.`);
          redirect('/access-points');
        }
      } catch (error) {
        console.error("Error fetching access point:", error);
        toast.error("An error occurred while fetching access point data.");
        redirect('/access-points');
      }
    };
    fetchAccessPoint();
  }, [accessPointId, router]);
  const handleEditAccessPoint = async () => {
    if (!accessPointName.trim()) {
      toast.error("Access Point Name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/request/UpdateAccessPoint/${accessPointId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: accessPointName }),
      });

      const result = await response.json();

      if (response.status && result.id) {
        toast.success("Access Point edited successfully!");
        router.push(`/access-points`);
      } else {
        toast.error(result.error || "Failed to edit Access Point.");
      }
    }
    catch (error) {
      console.error("Error editing access point:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteAccessPoint = async () => {
    console.log("Handle delete called")
    if (!window.confirm("Are you sure you wish to delete this access point?")) {
      return console.log("Not deleting");
    };
    window.alert("Now deleting");
    try {
      const response = await fetch(`/api/request/DeleteAccessPoint/${accessPointId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      });

      const result = await response.json();

      if (response.ok && result.deleted) {
        toast.success("Access Point deleted successfully!");
        router.push(`/access-points`);
      } else {
          toast.error(result.error || "Failed to delete Access Point.");
      }
    }
    catch (error) {
      console.error("Error deleting access point:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
 <div className="space-y-6">
 <div>
 <Label>Name</Label>
 <Input type="text" defaultValue={accessPointName} onChange={(e) => setAccessPointName(e.target.value)} />
 </div>
 </div>
 <div className="flex justify-end mt-6">
 <Button onClick={handleEditAccessPoint}>
            Edit access point
 </Button>

 <Button onClick={handleDeleteAccessPoint}>
            Delete access point
 </Button>
      </div>
    </>
  )
}