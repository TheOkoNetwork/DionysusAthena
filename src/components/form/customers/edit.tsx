'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState, useEffect } from "react";
import { useRouter, redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
interface CustomerEditFormProps {
  customerId: string;
}

export default function CustomerEditForm({ customerId }: CustomerEditFormProps) {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const router = useRouter();


  const handleEditCustomer = async () => {
    if (!givenName.trim()) {
      toast.error("Given name cannot be empty.");
      return;
    };
    if (!familyName.trim()) {
      toast.error("Family name cannot be empty.");
      return;
    };
    if (!email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    };
    if (!phoneNumber) {
      toast.error("Phone number cannot be empty.");
      return;
    };

    try {
      const response = await fetch(`/api/request/UpdateCustomer/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ given_name: givenName, family_name: familyName, email: email, phone_number: phoneNumber }),
      });

      const result = await response.json();

      if (response.status && result.id) {
        toast.success("Customer edited successfully!");
        router.push(`/customers`);
      } else {
        toast.error(result.error || "Failed to edit customer");
      }
    }
    catch (error) {
      console.error("Error editing customer:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteCustomer = async () => {
    console.log("Handle delete called")
    if (!window.confirm("Are you sure you wish to delete this customer?")) {
      return console.log("Not deleting");
    };
    window.alert("Now deleting");
    try {
      const response = await fetch(`/api/request/DeleteCustomer/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      });

      const result = await response.json();

      if (response.ok && result.deleted) {
        toast.success("Customer deleted successfully!");
        router.push(`/customers`);
      } else {
          toast.error(result.error || "Failed to delete Customer");
      }
    }
    catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/request/GetCustomer/${customerId}`);
        const data = await response.json();

        if (response.ok && data && data.id) {
          setGivenName(data.given_name);
          setFamilyName(data.family_name);
          setEmail(data.email);
          setPhoneNumber(data.phone_number);
        } else {
          toast.error(`Customer with ID ${customerId} not found.`);
          redirect('/customers');
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("An error occurred while fetching customer data.");
        redirect('/customers');
      }
    };
    fetchCustomer();
  }, [customerId, router]);


  return (
    <>
      <div className="space-y-6">
        <div>
          <Label>Given name</Label>
          <Input type="text" defaultValue={givenName} onChange={(e) => setGivenName(e.target.value)} />
        </div>
        <div>
          <Label>Family name</Label>
          <Input type="text" defaultValue={familyName} onChange={(e) => setFamilyName(e.target.value)} />
        </div>
      </div><div className="space-y-6">
        <div>
          <Label>Email address</Label>
          <Input type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Phone number</Label>
          <PhoneInput
            placeholder="Enter phone number"
            value={phoneNumber}
            defaultCountry="GB"
            onChange={setPhoneNumber} />
        </div>
      </div>
      <div className="flex justify-end mt-6">
      <Button onClick={handleEditCustomer}>
            Edit customer
 </Button>

 <Button onClick={handleDeleteCustomer}>
            Delete customer
 </Button>
      </div>
    </>
  )
}