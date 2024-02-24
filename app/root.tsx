import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react"
import { ServerCrash } from "lucide-react"

import "./tailwind.css"

import { MetaFunction } from "@remix-run/cloudflare"

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { title: "My app" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
]

export default function App() {
  return (
    <html lang="en" className="dark [color-scheme:dark] min-h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let element = <h1 className="text-3xl">Unknown Error</h1>
  if (isRouteErrorResponse(error)) {
    element = (
      <div>
        <h1 className="text-3xl">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  } else if (error instanceof Error) {
    console.error(error)
    element = (
      <div className="max-w-screen-lg">
        <h1 className="text-3xl flex items-center gap-2 text-red-500">
          <ServerCrash className="w-6 h-6 inline" />
          {error.stack?.split(":")[0] ?? "Error"}
        </h1>
        <p className="mt-2 mb-4 text-lg">{error.message}</p>
        <pre className="bg-muted p-4 rounded text-sm text-muted-foreground whitespace-pre-wrap">
          {error.stack}
        </pre>
      </div>
    )
  }

  return (
    <html lang="en" className="dark [color-scheme:dark] h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full min-w-full flex items-center justify-center">
        {element}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
