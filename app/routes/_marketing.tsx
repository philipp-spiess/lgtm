import { Outlet } from "@remix-run/react"

export default function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden antialiased bg-[#0a0a0b] text-white">
      <Outlet />
    </div>
  )
}
