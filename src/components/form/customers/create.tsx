'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function CustomerCreateForm() {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const router = useRouter();

  const handleCreateCustomer = async () => {
    if (!givenName.trim()) {
      toast.error("Given name cannot be empty.");
      return;
    }
    if (!familyName.trim()) {
      toast.error("Family name cannot be empty.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email address cannot be empty.");
      return;
    }
    if (!String(phoneNumber).trim()) {
      toast.error("Phone number cannot be empty.");
      return;
    }

    try {
      const response = await fetch('/api/request/CreateCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ givenName: givenName, familyName: familyName, email: email, phoneNumber: phoneNumber }),
      });

      const result = await response.json();

      if (response.status && result.id) {
        toast.success("Customer created successfully!");
        router.push(`/customers/${result.id}`);
      } else {
        toast.error(result.error || "Failed to create Customer.");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Label>Given name</Label>
          <Input type="text" onChange={(e) => setGivenName(e.target.value)} />
        </div>
        <div>
          <Label>Family name</Label>
          <Input type="text" onChange={(e) => setFamilyName(e.target.value)} />
        </div>
      </div><div className="space-y-6">
        <div>
          <Label>Email address</Label>
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Phone number</Label>
          <PhoneInput
      placeholder="Enter phone number"
      value={phoneNumber}
      defaultCountry="GB"
      onChange={setPhoneNumber}/>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleCreateCustomer}>
          Create customer
        </Button>
      </div>
    </>
  )
}
