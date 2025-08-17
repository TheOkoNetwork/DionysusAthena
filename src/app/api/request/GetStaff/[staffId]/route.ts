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

export async function GET(request: Request,
  { params }: { params: Promise<{ staffId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);

  const {staffId} = await params;
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `query qryStaffMember($staffId: String!) {
  staffMember(id: $staffId) {
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
        variables: {staffId: staffId},
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.staffMember as Staff), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching staff member:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch staff member",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
