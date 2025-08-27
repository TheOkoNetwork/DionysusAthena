import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface AccessPoint {
  id: string;
  name: string;
}

export async function GET(request: Request,
  { params }: { params: Promise<{ pdfTicketId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);

  const { pdfTicketId } = await params;
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `query qryPDFTicket($pdfTicketId: String!) {
      pdfTemplate(id: $pdfTicketId) {
        organiser_id
        id
        name
        template
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
        variables: { pdfTicketId: pdfTicketId },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.pdfTemplate), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching PDF template:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch PDF template",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
