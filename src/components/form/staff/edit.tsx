'use client';

import Label from "@/components/form/Label";
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button"
import { useState, useEffect } from "react";
import { useRouter, redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
interface StaffEditFormProps {
  staffId: string;
}

export default function StaffEditForm({ staffId }: StaffEditFormProps) {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const router = useRouter();


  const handleEditStaff = async () => {
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
    // if (!phoneNumber) {
    //   toast.error("Phone number cannot be empty.");
    //   return;
    // };

    try {
      const response = await fetch(`/api/request/UpdateStaff/${staffId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ given_name: givenName, family_name: familyName, email: email, phone_number: phoneNumber }),
      });

      const result = await response.json();

      if (response.status && result.id) {
        toast.success("Staff edited successfully!");
        router.push(`/staff`);
      } else {
        toast.error(result.error || "Failed to edit staff member");
      }
    }
    catch (error) {
      console.error("Error editing staff member:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteStaff = async () => {
    console.log("Handle delete called")
    if (!window.confirm("Are you sure you wish to delete this staff member?")) {
      return console.log("Not deleting");
    };
    window.alert("Now deleting");
    try {
      const response = await fetch(`/api/request/DeleteStaff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      });

      const result = await response.json();

      if (response.ok && result.deleted) {
        toast.success("Staff deleted successfully!");
        router.push(`/staff`);
      } else {
          toast.error(result.error || "Failed to delete Staff");
      }
    }
    catch (error) {
      console.error("Error deleting staff member:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`/api/request/GetStaff/${staffId}`);
        const data = await response.json();

        if (response.ok && data && data.id) {
          setGivenName(data.given_name);
          setFamilyName(data.family_name);
          setEmail(data.email);
          setPhoneNumber(data.phone_number);
        } else {
          toast.error(`Staff member with ID ${staffId} not found.`);
          redirect('/staff');
        }
      } catch (error) {
        console.error("Error fetching staff member:", error);
        toast.error("An error occurred while fetching staff member data.");
        redirect('/staff');
      }
    };
    fetchStaff();
  }, [staffId]);


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
      <Button onClick={handleEditStaff}>
            Edit staff member
 </Button>

 <Button onClick={handleDeleteStaff}>
            Delete staff member
 </Button>
      </div>
    </>
  )
}