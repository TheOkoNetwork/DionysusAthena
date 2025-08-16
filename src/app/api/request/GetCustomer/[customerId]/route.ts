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

export async function GET(request: Request,
  { params }: { params: Promise<{ customerId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);

  const {customerId} = await params;
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `query qryCustomer($customerId: String!) {
  customer(id: $customerId) {
    id
    given_name
    family_name
    email
    phone_number
  }
}`;

    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {customerId: customerId},
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.customer as Customer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching customer:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch customer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
