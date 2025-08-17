import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface Staff {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone_number: string;
}
export async function POST(  request: Request,
  { params }: { params: Promise<{ staffId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);
const { staffId } = await params;
  const { given_name, family_name,email,phone_number } = await request.json()

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutUpdateStaff($StaffId: String!, $given_name: String!, $family_name: String!, $email: String!, $phone_number: String) {
  updateStaff(id: $StaffId, given_name: $given_name, family_name: $family_name, email: $email,phone_number: $phone_number) {
    ... on staff {
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

console.log(`Updating with staff ID: ${staffId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          StaffId: staffId,
          given_name,
          family_name,
          email,
          phone_number
        },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.updateStaff as Staff), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating staff member:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to update staff member",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
