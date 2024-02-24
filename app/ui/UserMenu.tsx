import { useNavigate } from "@remix-run/react"
import type { MouseEvent } from "react"
import type { User } from "~/db.server/schema"

interface Props {
  user: Pick<User, "avatar">
}
export default function UserMenu({ user }: Props) {
  const navigate = useNavigate()

  async function logout(event: MouseEvent) {
    event.preventDefault()
    await fetch("/auth/logout", { method: "POST" })
    navigate("/")
  }

  return (
    <button
      className="flex text-sm rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      onClick={logout}
      type="button"
    >
      <img
        className="w-10 h-10 rounded-full"
        src={user.avatar ?? "https://i.pravatar.cc/150?img=1"}
        alt="Avatar"
      />
    </button>
  )
}
