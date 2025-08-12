import { config } from "dotenv";

config();

export async function GET(req: Request): Promise<Response> {
  const domain = req.headers.get("host");
  const single_signout_url = process.env.AUTH_OIDC_ISSUER+`/oidc/v1/end_session?client_id=${process.env.AUTH_OIDC_CLIENT_ID}&post_logout_redirect_uri=https://${domain}/signed_out&state=${Date.now()}`;
  console.log(single_signout_url);
  return Response.redirect(single_signout_url);
}
