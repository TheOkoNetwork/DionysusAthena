import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function DELETE(  request: Request,
  { params }: { params: Promise<{ customerId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { customerId } = await params;

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutDeleteCustomer($CustomerId: String!) {
  deleteCustomer(id: $CustomerId) {
    ... on deletionResult {
      deleted
    }
    ... on errorResult {
      error
    }
  }
}`;

    console.log(`Deleting customer ID: ${customerId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { CustomerId: customerId },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.deleteCustomer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting customer:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to delete customer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
