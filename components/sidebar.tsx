"use client"

import { cn } from "@/lib/utils"
import { BarChart3, Building2, Coins, LayoutDashboard, LogOut, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-400",
  },
  {
    label: "Real Estate",
    icon: Building2,
    href: "/dashboard/real-estate",
    color: "text-violet-400",
  },
  {
    label: "Stocks",
    icon: BarChart3,
    href: "/dashboard/stocks",
    color: "text-pink-500",
  },
  {
    label: "Crypto",
    icon: Coins,
    href: "/dashboard/crypto",
    color: "text-orange-400",
  },
  {
    label: "Other Assets",
    icon: Wallet,
    href: "/dashboard/other",
    color: "text-emerald-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-white/5">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-75 blur-md" />
             <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg w-full h-full flex items-center justify-center shadow-lg">
                <span className="font-bold text-lg text-white">A</span>
             </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Asset <span className="text-blue-500">A</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200",
                pathname === route.href 
                  ? "text-white bg-white/10 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", pathname === route.href ? route.color : "text-zinc-500 group-hover:text-white")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
         <Link
            href="/"
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-red-400 hover:bg-red-500/10 rounded-xl transition text-zinc-400"
          >
            <div className="flex items-center flex-1">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </div>
          </Link>
      </div>
    </div>
  )
}
