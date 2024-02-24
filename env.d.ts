/// <reference types="@remix-run/cloudflare" />
/// <reference types="vite/client" />

import type { D1Database } from "@cloudflare/workers-types"
import type { DB } from "./app/db.server/schema"
declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    db: DB
    env: {
      // Env vars
      AUTH_SECRET: string
      GITHUB_ID: string
      GITHUB_SECRET: string
      ENV: "development" | "production"
    }
  }
}
