import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface AccessPoint {
  id: string;
  name: string;
}
interface Params {
  accessPointId: string;
}
export async function POST(request: Request, response:Response, { params }: { params: Params }): Promise<Response> {
  const session = await getServerSession(authOptions);
const { accessPointId } = await params;
  const { name: AccessPointName } = await request.json()

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutUpdateAccessPoint($AccessPointId: String!, $name: String!) {
  updateAccessPoint(id: $AccessPointId, name: $name) {
    ... on accessPoint {
      id
      name
    }
    ... on errorResult {
      error
    }
  }
}`;

console.log(`Updating with access point ID: ${accessPointId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { AccessPointId: accessPointId, name: AccessPointName },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.updateAccessPoint as AccessPoint), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating access point:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to update access point",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
