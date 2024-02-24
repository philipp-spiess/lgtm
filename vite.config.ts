import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from "@remix-run/dev"
import { defineConfig } from "vite"
import envOnly from "vite-env-only"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy({
      async getLoadContext() {
        const [{ getPlatformProxy }, { drizzle }, { default: schema }] =
          await Promise.all([
            import("wrangler"),
            import("drizzle-orm/d1"),
            import("./app/db.server/schema"),
          ])
        const proxy = await getPlatformProxy<{
          DB: D1Database
          AUTH_SECRET: string
          GITHUB_ID: string
          GITHUB_SECRET: string
          ENV: "production" | "development"
        }>({ persist: true })
        const db = drizzle(proxy.env.DB, { schema })

        return {
          db,
          env: proxy.env,
        }
      },
    }),
    remix(),
    tsconfigPaths(),
    envOnly(),
  ],
})
