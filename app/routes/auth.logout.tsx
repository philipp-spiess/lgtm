import { ActionFunctionArgs } from "@remix-run/cloudflare"
import { createAuthenticator } from "~/.server/auth"

export async function action({ context, request }: ActionFunctionArgs) {
  const authenticator = createAuthenticator(context)
  await authenticator.logout(request, { redirectTo: "/" })
}

export default function Logout() {
  return null
}
