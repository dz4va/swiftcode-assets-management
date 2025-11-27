"use client"

import { useAssets, AssetType } from "@/components/asset-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddAssetForm } from "@/components/add-asset-form"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CategoryPage() {
  const { getAssetsByType } = useAssets()
  const params = useParams()
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Convert slug to AssetType (simple mapping)
  const slugToType: Record<string, AssetType> = {
    "real-estate": "Real Estate",
    "stocks": "Stocks",
    "crypto": "Crypto",
    "private-equity": "Private Equity",
    "cash": "Cash",
    "collectibles": "Collectibles",
    "other": "Other"
  }

  const categorySlug = params.category as string
  const categoryType = slugToType[categorySlug]
  const assets = categoryType ? getAssetsByType(categoryType) : []

  if (!categoryType) {
      return <div className="p-8 text-white">Category not found</div>
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
             <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
             </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{categoryType}</h2>
            <p className="text-muted-foreground">Manage your {categoryType.toLowerCase()} assets.</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="premium">
          <Plus className="mr-2 h-4 w-4" /> Add Asset
        </Button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <AddAssetForm onClose={() => setShowAddForm(false)} />
        </motion.div>
      )}

      <Card className="bg-neutral-900/50 border-white/10">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.currency}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  ${asset.value.toLocaleString()}
                </div>
              </div>
            ))}
            {assets.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No {categoryType.toLowerCase()} assets found. Add one to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
