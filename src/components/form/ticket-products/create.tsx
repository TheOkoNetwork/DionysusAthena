'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { TicketType } from '@/types/tickets';

export default function TicketProductCreateForm() {
  const [name, setName] = useState('');
  const router = useRouter();


  const handleCreateTicketProduct = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    
    try {
      const response = await fetch('/api/request/CreateTicketProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name, 
        }),
      });

      const result = await response.json();

      if (response.ok && result.id) {
        toast.success("Ticket product created successfully!");
        router.push(`/ticket-products`);
      } else {
        toast.error(result.error || "Failed to create ticket product.");
      }
    } catch (error) {
      console.error("Error creating ticket product:", error);
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
        <Button onClick={handleCreateTicketProduct}>
          Create Ticket Product
        </Button>
      </div>
    </>
  )
}