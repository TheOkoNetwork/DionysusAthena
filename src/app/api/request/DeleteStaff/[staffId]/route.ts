import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function DELETE(  request: Request,
  { params }: { params: Promise<{ staffId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { staffId } = await params;

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutDeleteStaff($StaffId: String!) {
  deleteStaff(id: $StaffId) {
    ... on deletionResult {
      deleted
    }
    ... on errorResult {
      error
    }
  }
}`;

    console.log(`Deleting staff ID: ${staffId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { StaffId: staffId },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.deleteStaff), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting staff member:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to delete staff member",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
