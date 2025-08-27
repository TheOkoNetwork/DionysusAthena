import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { Template } from '@pdfme/common';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface PDFTemplate {
  id: string;
  name: string;
  organiser_id: string;
  template: Template;
}

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
    const query = `query qryPDFTemplates {
            pdfTemplates {
                organiser_id
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

    return new Response(JSON.stringify(data.data.pdfTemplates as PDFTemplate[]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching list of PDF templates:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch PDF templates",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
