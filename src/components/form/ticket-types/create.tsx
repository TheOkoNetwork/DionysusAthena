'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function TicketTypeCreateForm() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleCreateTicketType = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      const response = await fetch('/api/request/CreateTicketType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name
        }),
      });

      const result = await response.json();

      if (response.ok && result.id) {
        toast.success("Ticket type created successfully!");
        router.push(`/ticket-types`);
      } else {
        toast.error(result.error || "Failed to create ticket type.");
      }
    } catch (error) {
      console.error("Error creating ticket type:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input type="text" defaultValue={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleCreateTicketType}>
          Create Ticket Type
        </Button>
      </div>
    </>
  )
}