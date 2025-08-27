import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function POST(  request: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { templateName,templateJson } = await request.json()

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutCreatePdfTemplate($templateName: String!, $template: String!) {
  createPdfTemplate(name: $templateName, template: $template) {
    ... on pdfTemplate {
      id
      name
    }
    ... on errorResult {
      error
    }
  }
}`;

console.log(`Creating PDF template`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { templateName: templateName,template: templateJson },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.createPdfTemplate), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating template:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create template",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
