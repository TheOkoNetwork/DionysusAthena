import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { givenName,familyName, email,phoneNumber } = await request.json()
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutCreateCustomer($given_name: String!,$family_name: String!,$email: String!,$phone_number: String!) {
  createCustomer(given_name: $given_name, family_name: $family_name, email: $email, phone_number: $phone_number) {
    ... on customer {
      id
    }
    ... on errorResult {
      error
    }
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
        variables: { given_name: givenName, family_name: familyName, email: email, phone_number: phoneNumber },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.createCustomer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create customer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
