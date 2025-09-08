import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type ScanResults = {
  acknowledgeRequired?: boolean,
  message?: string,
  status?: 'ACCEPTED' | 'REJECTED' | 'ATTENTION' | 'OFFLINE',
  ticketHolder?: string,
  product?: string,
  type?: string
}

export async function POST(request: Request,): Promise<Response> {
  const session = await getServerSession(authOptions);
  const { barcode, access_point_id, scanning_engine } = await request.json()
  console.log(`Validating barcode: ${barcode} at access point: ${access_point_id}`)
  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `mutation mutValidateTicket($barcode: String!, $accessPointId: String!, $software: String!, $softwareVersion: String!) {
  validate(barcode: $barcode, access_point_id: $accessPointId, software: $software, software_version: $softwareVersion) {
    status
    acknowledgeRequired
    message
    ticketHolder
    product
    type
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
        variables: {
          barcode: barcode,
          accessPointId: access_point_id,
          software: `ATHENA_${scanning_engine}`,
          softwareVersion: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_BUILD_ID || 'DEV'
        },
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.validate as ScanResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error validating ticket:", error);

    return new Response(
      JSON.stringify({
        status: "REJECTED",
        acknowledgeRequired: true,
        message: 'Error submitting scan from Athena to Olympus'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
