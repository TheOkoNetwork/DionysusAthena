import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

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
    const query = `query qryTemplatePdfFonts {
      templatePdfFonts {
        name
        data
        subset
        fallback
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

    console.log(JSON.stringify(data));


    const fonts_list = data.data.templatePdfFonts;

    const fontsResponse: { [key: string]: { data: string,subset: boolean, fallback?: boolean } } = {};
    fonts_list.forEach(function (font: { name: string; data: string; subset: boolean; fallback: boolean; }) {
        fontsResponse[font.name] = {
            data: font.data,
            subset: font.subset,
            fallback: font.fallback
        };
    });

    return new Response(JSON.stringify(fontsResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching template PDF fonts:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch template PDF fonts",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
