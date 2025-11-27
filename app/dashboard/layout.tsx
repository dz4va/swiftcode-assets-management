import { Sidebar } from "@/components/sidebar"
import { AssetProvider } from "@/components/asset-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AssetProvider>
      <div className="h-full relative bg-black">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
          <Sidebar />
        </div>
        <main className="md:pl-72 h-full">
          {children}
        </main>
      </div>
    </AssetProvider>
  )
}
