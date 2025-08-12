import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface Params {
  accessPointId: string;
}
export async function DELETE(request: Request, response: Response, { params }: { params: Params }): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { accessPointId } = await params;

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutDeleteAccessPoint($AccessPointId: String!) {
  deleteAccessPoint(id: $AccessPointId) {
    ... on deletionResult {
      deleted
    }
    ... on errorResult {
      error
    }
  }
}`;

    console.log(`Deleting access point ID: ${accessPointId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { AccessPointId: accessPointId },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.deleteAccessPoint), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting access point:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to delete access point",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
