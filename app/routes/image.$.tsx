import { LoaderFunctionArgs } from "@remix-run/cloudflare"

export async function loader({ params, context }: LoaderFunctionArgs) {
  const key = params["*"]!
  const object = await context.bucket.get(key)

  if (object === null) {
    return new Response("Object Not Found", { status: 404 })
  }

  const headers = new Headers()
  for (const [key, value] of Object.entries(object.httpMetadata ?? {})) {
    headers.set(key, value)
  }
  headers.set("etag", object.httpEtag)

  return new Response(object.body, {
    headers,
  })
}
