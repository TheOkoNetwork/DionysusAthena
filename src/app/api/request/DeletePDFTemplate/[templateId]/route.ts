import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function DELETE(  request: Request,
  { params }: { params: Promise<{ templateId: string }> }): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { templateId } = await params;

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutDeletePdfTemplate($templateId: String!) {
  deletePdfTemplate(id: $templateId) {
    ... on deletionResult {
      deleted
    }
    ... on errorResult {
      error
    }
  }
}`;

    console.log(`Deleting PDF template ID: ${templateId}`)
    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: { templateId: templateId },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.deletePdfTemplate), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting PDF template:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to delete PDF template",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
