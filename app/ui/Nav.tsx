import { useNavigation } from "@remix-run/react"
import { type PropsWithChildren, useEffect, useState } from "react"
import { serverOnly$ } from "vite-env-only"

import { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { requireUser } from "~/.server/auth"
import { SafeUser } from "~/db.server/schema"
import LoadingSpinner from "./LoadingSpinner"
import UserMenu from "./UserMenu"

export const navLoader = serverOnly$(
  async ({
    context,
    request,
  }: Pick<LoaderFunctionArgs, "request" | "context">) => {
    const user = await requireUser(context, request)
    return { user }
  },
)

export default function Nav({
  children,
  user,
}: PropsWithChildren<{ user: Pick<SafeUser, "ghUsername" | "avatar"> }>) {
  const navigation = useNavigation()
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
  useEffect(() => {
    if (navigation.state !== "loading") {
      if (showLoadingSpinner) {
        setShowLoadingSpinner(false)
      }
      return
    }
    const id = setTimeout(() => setShowLoadingSpinner(true), 200)
    return () => clearTimeout(id)
  }, [showLoadingSpinner, navigation])

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-grow min-h-0 flex">
        <div className="flex justify-between flex-col h-full py-2 border-border border-r w-28">
          <div className="flex flex-col items-center justify-end gap-2">
            {showLoadingSpinner ? <LoadingSpinner /> : null}
          </div>
        </div>
        <div>
          <UserMenu user={user} />
        </div>
      </div>
      <div className="ml-[500px] flex-grow min-w-0">{children}</div>
    </div>
  )
}
