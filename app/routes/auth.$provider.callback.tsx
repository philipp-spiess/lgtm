import { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { createAuthenticator } from "~/.server/auth"

export async function loader({ context, request, params }: LoaderFunctionArgs) {
  const authenticator = createAuthenticator(context)

  return authenticator.authenticate(params.provider!, request, {
    successRedirect: "/app",
    throwOnError: true,
  })
}
