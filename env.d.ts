/// <reference types="@remix-run/cloudflare" />
/// <reference types="vite/client" />

import type { DB } from "./app/db.server/schema"
declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    db: DB
    bucket: R2Bucket
    env: {
      // Env vars
      AUTH_SECRET: string
      GITHUB_ID: string
      GITHUB_SECRET: string
      ENV: "development" | "production"
    }
  }
}
