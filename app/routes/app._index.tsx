import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare"
import { useFetcher, useLoaderData } from "@remix-run/react"
import Nav, { navLoader } from "~/ui/Nav"

export async function loader({ context, request }: LoaderFunctionArgs) {
  return json({ ...(await navLoader!({ context, request })) })
}

export async function action({ request, context }: ActionFunctionArgs) {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
  })
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const image = formData.get("img") as File

  context.bucket.put(image.name, await image.arrayBuffer())

  return redirect("/app")
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

  return (
    <Nav user={user}>
      <fetcher.Form method="post" encType="multipart/form-data">
        <input type="file" name="img" accept="image/*" />
        <button type="submit">Upload to S3</button>
      </fetcher.Form>
    </Nav>
  )
}
