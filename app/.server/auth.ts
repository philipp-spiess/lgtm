import {
  AppLoadContext,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/cloudflare"
import { eq } from "drizzle-orm"
import { Authenticator } from "remix-auth"
import { type GitHubScope, GitHubStrategy } from "remix-auth-github"
import { type NewUser, SafeUser, type User, users } from "../db.server/schema"
import { githubUserDetailsForToken } from "./github"

export function createAuthenticator(context: AppLoadContext) {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [context.env.AUTH_SECRET],
      secure: context.env.ENV === "production",
    },
  })

  const gitHubScope = ["user:email"] satisfies GitHubScope[]
  const gitHubStrategy = new GitHubStrategy(
    {
      clientID: context.env.GITHUB_ID,
      clientSecret: context.env.GITHUB_SECRET,
      callbackURL:
        context.env.ENV === "production"
          ? "https://jumpstart.spiess.dev/auth/github/callback"
          : "http://localhost:5173/auth/github/callback",
      scope: gitHubScope,
    },
    async ({ context: _context, ...response }) => {
      const { email, name, avatar_url: avatar } = response.profile._json
      const user = await findOrCreateUser(context, {
        email,
        name,
        avatar,
        ghAccessToken: response.accessToken,
        ghUsername: response.profile.displayName,
      })
      return user.id
    },
  )

  // Create an instance of the authenticator, pass a generic with what
  // strategies will return and will store in the session
  const authenticator = new Authenticator<User["id"]>(sessionStorage)
  authenticator.use(gitHubStrategy)

  return authenticator
}

export async function findOrCreateUser(
  context: AppLoadContext,
  newUser: NewUser,
): Promise<SafeUser> {
  const insertedUsers = context.db
    .insert(users)
    .values(newUser)
    .onConflictDoUpdate({ target: users.email, set: newUser })
    .returning()
  return safe(await insertedUsers.get())
}

export async function findUserByGithubAccessToken(
  context: AppLoadContext,
  accessToken: string,
): Promise<SafeUser | null> {
  const githubUserDetails = await githubUserDetailsForToken(accessToken)
  const selectedUsers = context.db
    .select()
    .from(users)
    .where(eq(users.email, githubUserDetails.email))
    .limit(1)
  const user = await selectedUsers.get()
  if (user && isAllowed(user)) {
    return safe(user)
  }
  return null
}

export async function currentUser(
  context: AppLoadContext,
  request: Request,
): Promise<SafeUser> {
  return await requireUser(context, request)
}

export async function requireUser(
  context: AppLoadContext,
  request: Request,
): Promise<SafeUser> {
  const authenticator = createAuthenticator(context)
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  const user = await context.db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get()

  if (!user) {
    throw redirect("/", 302)
  }

  if (isAllowed(user)) {
    return safe(user)
  }

  throw redirect("/joined", 302)
}

export function isAllowed(user: Pick<User, "ghUsername">) {
  switch (user.ghUsername) {
    case "philipp-spiess":
      return true
    default:
      return false
  }
}

export function safe(user: User): SafeUser {
  const { ghAccessToken, ...safeUser } = user
  return safeUser
}
