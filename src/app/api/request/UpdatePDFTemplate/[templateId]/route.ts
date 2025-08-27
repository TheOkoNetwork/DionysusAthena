import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function POST(  request: Request,
  { params }: { params: Promise<{ templateId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);
const { templateId } = await params;
  const { templateName,templateJson } = await request.json()

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutUpdatePdfTemplate($templateId: String!, $templateName: String!, $template: String!) {
  updatePdfTemplate(id: $templateId, name: $templateName, template: $template) {
    ... on pdfTemplate {
      id
      name
    }
    ... on errorResult {
      error
    }
  }
}`;

console.log(`Updating with PDF template ID: ${templateId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { templateId: templateId, templateName: templateName,template: templateJson },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.updatePdfTemplate), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating template:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to update template",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
