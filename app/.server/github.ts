export async function githubUserDetailsForToken(token: string) {
  return (await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).json()) as {
    login: string
    email: string
    avatar_url: string | undefined
    name: string
  }
}
