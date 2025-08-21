import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { name } = await request.json();
  
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  
  try {
    const query = `mutation mutCreateTicketProduct($name: String!) {
      createTicketProduct(name: $name) {
        ... on ticketProduct {
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
        variables: { 
          name: name
        },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.createTicketProduct), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating ticket product:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create ticket product",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}