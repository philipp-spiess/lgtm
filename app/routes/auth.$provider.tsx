import { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { createAuthenticator } from "../.server/auth"

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const authenticator = createAuthenticator(context)

  // Ensure we go through the oauth flow even if we're logged in already
  request.headers.set("Cookie", "")

  await authenticator.authenticate(params.provider!, request, {
    successRedirect: "/app",
    throwOnError: true,
  })
}
