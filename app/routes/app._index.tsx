import { LoaderFunctionArgs, json } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import Nav, { navLoader } from "~/ui/Nav"

export async function loader({ context, request }: LoaderFunctionArgs) {
  return json({ ...(await navLoader!({ context, request })) })
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()

  return <Nav user={user} />
}
