import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { TicketProductType } from "@/types/tickets";

export async function GET(): Promise<Response> {
  const session = await getServerSession(authOptions);

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  
  try {
    const query = `query qryTicketProductTypes {
      ticketProductTypes {
        id
        name
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
        variables: {},
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.ticketProductTypes as TicketProductType[]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching list of ticket product types:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch ticket product types",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}