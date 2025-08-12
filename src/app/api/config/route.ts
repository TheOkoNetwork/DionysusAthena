import { config } from "dotenv";

config();

export async function GET(req: Request): Promise<Response> {
  const domain = req.headers.get("host");
  console.log(`Using domain: ${domain} and olympus url: ${process.env.OLYMPUS_URL}`)
  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `
            query SalesChannelLookup($domain: String!) {
                salesChannelLookupByDomain(domain: $domain) {
                    name
                    slogan
                    logo
                    staff_identity_store_id
                }
            }
        `;

    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { domain },
      }),
    });

    const data = await response.json();
console.log(data);
    return new Response(JSON.stringify(data.data.salesChannelLookupByDomain), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error looking up sales channel for domain: ${domain}`, error);

    return new Response(
      JSON.stringify({
        error: `Failed to lookup sales channel for domain: ${domain}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
