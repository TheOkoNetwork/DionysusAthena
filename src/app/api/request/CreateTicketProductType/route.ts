import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { name, description, active } = await request.json();
  
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  
  try {
    const query = `mutation mutCreateTicketProductType($name: String!, $description: String, $active: Boolean!) {
      createTicketProductType(name: $name, description: $description, active: $active) {
        ... on ticketProductType {
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
        variables: { name: name, description: description, active: active },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.createTicketProductType), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating ticket product type:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create ticket product type",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}