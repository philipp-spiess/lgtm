# Welcome to 🔋 Jumpstart

🔋 Jumpstart is batteries-included Remix starter kit by [Philipp Spiess](https://spiess.dev).

## Getting started

```bash
npx create-remix@latest --template philipp-spiess/jumpstart
```

## What's included

- **🧱 App framework:** [Remix](https://remix.run), [Vite](https://vitejs.dev) and [React](https://reactjs.org)
- **🪲 Linting and Typechecking**: [TypeScript](https://www.typescriptlang.org) and [Biome](https://biomejs.dev/)
- **🔬 Testing**: [Vitest](https://vitest.dev) and [React Testing Library](https://testing-library.com)
- **🗄️ ORM**: [Drizzle](https://orm.drizzle.team/) on [Cloudflare D1](https://developers.cloudflare.com/d1)
- **🎨 UI and Styling**: [Tailwind](https://tailwindcss.com), [shadecn/ui](https://ui.shadcn.com), and [Taxonomy](https://tx.shadcn.com/).
- **🔒 Authentication**: [remix-auth](https://github.com/sergiodxa/remix-auth) and [remix-auth-github](https://github.com/sergiodxa/remix-auth-github)
- **🌩️ Deployment**: [Cloudflare Pages](https://pages.cloudflare.com)
- **🔄 CI/CD**: [Github Actions](https://github.com/features/actions)

## What's coming?

Here are some features that I want to add in the future. Create an issue if you want to see something else.

- [ ] Analytics, error logging, logs, and tracing via [Logkit](https://logkit.co)
- [ ] Dark/light mode support
- [ ] Feature flags
- [ ] Authorization
- [ ] Mutli-tenancy and teams
- [ ] Self service via [Stripe](https://stripe.com)
- [ ] Emails and background/scheduled workers
- [ ] Admin panel
- [ ] Marketing tools (Blog, Docs)

## Learn more

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## First steps

Before you start development, you'll need to install the dependencies and configure the local development environment. For managing the `node` and `pnpm` versions, we recommend using [mise](https://mise.jdx.dev/).

```bash
pnpm install
cp .dev.vars.sample .dev.vars
pnpm db:migrate
```

If you wish to use GitHub authentication, you'll need to [create a new GitHub application[https://github.com/settings/developers]. Steps for this can be found in the example `.dev.vars` config.

## Development

```bash
pnpm run dev
```

## Deployment

This project is set up continuously to deploy to [Cloudflare Pages](https://pages.cloudflare.com). For your first deployment, you'll need to set up a new project in Cloudflare Pages.

1. Create a new project via Wrangler

   ```bash
   pnpm wrangler pages project create <PROJECT_NAME>
   ```
1. Create a new DB via [Cloudflare D1](https://developers.cloudflare.com/d1)

   ```bash
   pnpm wrangler d1 create <PROJECT_NAME>
   ```
1. Change the name of the project from `jumpstart` to your `<PROJECT_NAME>` in the following files:
    - `wrangler.toml` (the `name` and `d1_databases` bindings)
    - `.github/workflows/ci.yml` (in the migration step)
    - `package.json` (in the `deploy` and `db:migrate` scripts)
1. Change the production URL of the project in `app/.server.auth`.
1. Configure environment variables in Cloudflare Pages (check the `.dev.vars` file for the required variables). This can be done from the [Cloudflare UI](https://dash.cloudflare.com/).

## Setting up GitHub Actions

1. [Create a Cloudflare access token](https://dash.cloudflare.com/profile/api-tokens/) with the `Edit Cloudflare Workers` preset.

   ⚠️ **Important:** Make sure to additionally add `D1` edit permissions, otherwise automated database migrations will fail.
1. In GitHub, go to `Settings > Secrets and variables > Actions` and add a new environment _secret_ with the `CLOUDFLARE_API_TOKEN` name and the token created in the previous step.
