import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface Customer {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone_number: string;
}
export async function POST(  request: Request,
  { params }: { params: Promise<{ customerId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);
const { customerId } = await params;
  const { given_name, family_name,email,phone_number } = await request.json()

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutUpdateCustomer($CustomerId: String!, $given_name: String!, $family_name: String!, $email: String!, $phone_number: String!) {
  updateCustomer(id: $CustomerId, given_name: $given_name, family_name: $family_name, email: $email,phone_number: $phone_number) {
    ... on customer {
      id
      given_name
      family_name
      email
      phone_number
    }
    ... on errorResult {
      error
    }
  }
}`;

console.log(`Updating with customer ID: ${customerId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          CustomerId: customerId,
          given_name,
          family_name,
          email,
          phone_number
        },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.updateCustomer as Customer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating customer:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to update customer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
