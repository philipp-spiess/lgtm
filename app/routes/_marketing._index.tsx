import { LoaderFunctionArgs, json } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import { Copy } from "lucide-react"
import { useState } from "react"

export function headers() {
  return {
    // max-age = 5 minutes
    // stale-while-revalidate = 1 week
    "Cache-Control": "max-age=300, stale-while-revalidate=604800",
  }
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const list = await context.bucket.list()
  return json({ images: list.objects.map((o) => o.key) })
}

export default function Index() {
  const { images } = useLoaderData<typeof loader>()
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [copiedImage, setCopiedImage] = useState<string | null>(null)

  function copyToClipboard(image: string) {
    navigator.clipboard.writeText(
      `![${image}](https://lgtm.spiess.dev/image/${image})`,
    )
    setCopiedImage(image)
    setTimeout(() => {
      setCopiedImage(null)
    }, 1000)
  }

  return (
    <>
      <div className="flex flex-col items-center my-28">
        <h1 className="text-4xl font-bold text-center mb-8">
          Make Your Reviews Fun Again
        </h1>
        <Link
          to="/auth/github"
          className="rounded-full bg-primary relative text-base font-semibold text-white flex h-11 w-full items-center justify-center px-6 sm:w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          <svg
            className="mr-2 -ml-1 w-4 h-4 text-primary-foreground"
            role="img"
            aria-label="GitHub"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <path
              fill="currentColor"
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            />
          </svg>

          <span className="text-primary-foreground">Join the wait list</span>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {images.map((image) => (
          <button
            type="button"
            onMouseEnter={() => setHoveredImage(image)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => copyToClipboard(image)}
            className="relative"
          >
            <img
              key={image}
              alt={image}
              src={`/image/${image}`}
              className="rounded-sm shadow-lg max-w-sm mx-auto cursor-pointer"
              style={{ maxWidth: "600px" }}
            />
            {hoveredImage === image && (
              <div className="absolute inset-0 bg-black opacity-50 rounded-sm shadow-lg  flex items-center justify-center">
                <p className="text-white text-center text-lg font-bold">
                  {copiedImage === image ? (
                    "Copied!"
                  ) : (
                    <>
                      <Copy className="w-6 h-6 inline mr-2" />
                      Copy to clipboard
                    </>
                  )}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  )
}
