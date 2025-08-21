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
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>();
  const [ticketTypeId, setTicketTypeId] = useState('');
  const [active, setActive] = useState(true);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch ticket types for the dropdown
    fetch('/api/request/GetTicketTypes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTicketTypes(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching ticket types:', error);
      });
  }, []);

  const handleCreateTicketProduct = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!ticketTypeId) {
      toast.error("Please select a ticket type.");
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
          description: description || undefined, 
          price: price,
          ticketTypeId: ticketTypeId,
          active: active 
        }),
      });

      const result = await response.json();

      if (response.ok && result.id) {
        toast.success("Ticket product created successfully!");
        router.push(`/ticket-products/${result.id}`);
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
        <div>
          <Label>Description</Label>
          <Input type="text" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>Price</Label>
          <Input 
            type="number" 
            step={0.01}
            defaultValue={price || ''} 
            onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : undefined)} 
          />
        </div>
        <div>
          <Label>Ticket Type</Label>
          <select 
            value={ticketTypeId} 
            onChange={(e) => setTicketTypeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a ticket type</option>
            {ticketTypes.map((ticketType) => (
              <option key={ticketType.id} value={ticketType.id}>
                {ticketType.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>
            <input 
              type="checkbox" 
              checked={active} 
              onChange={(e) => setActive(e.target.checked)} 
              className="mr-2"
            />
            Active
          </Label>
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