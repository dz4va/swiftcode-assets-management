"use client"

import { useAssets, Asset } from "@/components/asset-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddAssetForm } from "@/components/add-asset-form"
import { EditAssetModal } from "@/components/edit-asset-modal"
import { Button } from "@/components/ui/button"
import { DollarSign, Plus, TrendingUp, Wallet, Activity, Edit2, Trash2, ChevronDown } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { assets, totalValue, netWorth, totalDebt, totalMonthlyPayments, removeAsset } = useAssets()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // Calculate some stats (excluding debts from top asset)
  const nonDebtAssets = assets.filter(a => a.type !== "Debt")
  const topAsset = nonDebtAssets.reduce((prev, current) => (prev.value > current.value) ? prev : current, nonDebtAssets[0] || { name: "N/A", value: 0, change24h: 0 })
  const totalChange = nonDebtAssets.reduce((acc, curr) => acc + (curr.change24h || 0), 0) / (nonDebtAssets.length || 1)
  
  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  return (
    <div className="p-8 min-h-screen text-white relative">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/10 blur-[120px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Dashboard</h2>
          <p className="text-neutral-400 mt-1">Your wealth ecosystem at a glance.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="premium" size="lg" className="shadow-lg shadow-purple-500/20">
          <Plus className="mr-2 h-5 w-5" /> Add Asset
        </Button>
      </div>

      {showAddForm && <AddAssetForm onClose={() => setShowAddForm(false)} />}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        
        {/* Total Net Worth - Large Card */}
        <Card className="md:col-span-2 lg:col-span-2 bg-neutral-900/30 backdrop-blur-xl border-white/10 relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
          
          {/* Gradient orb */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Net Worth</span>
              </div>
              
              {/* Massive number with glow */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"></div>
                <div className="relative text-7xl md:text-8xl font-black tracking-tighter">
                  <span className="bg-gradient-to-br from-white via-white to-neutral-400 bg-clip-text text-transparent">
                    ${(netWorth / 1000).toFixed(1)}
                  </span>
                  <span className="text-4xl md:text-5xl text-neutral-500 ml-1">k</span>
                </div>
              </motion.div>
              
              {/* Stats row */}
              <div className="flex items-center gap-6">
                {/* Change indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">+{totalChange.toFixed(1)}%</span>
                </div>
                
                {/* Divider */}
                <div className="w-px h-4 bg-white/10"></div>
                
                {/* Asset count */}
                <div className="text-sm text-neutral-500">
                  <span className="font-semibold text-white">{assets.filter(a => a.type !== "Debt").length}</span> Assets
                </div>
              </div>
              
              {/* Breakdown bar */}
              <div className="w-full max-w-md space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Assets vs Debts</span>
                  <span>{totalValue > 0 ? ((totalValue / (totalValue + totalDebt)) * 100).toFixed(0) : 0}% / {totalDebt > 0 ? ((totalDebt / (totalValue + totalDebt)) * 100).toFixed(0) : 0}%</span>
                </div>
                <div className="h-2 bg-neutral-800/50 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${totalValue > 0 ? (totalValue / (totalValue + totalDebt)) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${totalDebt > 0 ? (totalDebt / (totalValue + totalDebt)) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="bg-gradient-to-r from-red-500 to-rose-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400">${(totalValue / 1000).toFixed(1)}k</span>
                  <span className="text-red-400">${(totalDebt / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performer */}
        <Card className="bg-neutral-900/50 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Top Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-emerald-400 font-bold">+{topAsset.change24h?.toFixed(2)}%</span>
            </div>
            <div className="text-2xl font-bold truncate">{topAsset.name}</div>
            <div className="text-neutral-500">${topAsset.value.toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Debt Summary Card */}
        <Card className="bg-gradient-to-br from-red-950/20 to-neutral-900/50 border-red-500/10 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
          
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Debt Overview</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {/* Big Debt Number */}
              <div className="text-center py-2">
                <div className="text-xs text-neutral-500 mb-2">Total Outstanding</div>
                <div className="text-4xl font-bold text-red-400 mb-1">
                  ${totalDebt.toLocaleString()}
                </div>
                <div className="text-xs text-neutral-600">{assets.filter(a => a.type === "Debt").length} active {assets.filter(a => a.type === "Debt").length === 1 ? 'debt' : 'debts'}</div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Monthly Payment */}
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-red-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-neutral-500">Monthly</span>
                  </div>
                  <div className="text-lg font-bold text-red-400">${totalMonthlyPayments.toLocaleString()}</div>
                </div>
                
                {/* Debt Reduction */}
                <div className="bg-neutral-900/60 p-3 rounded-xl border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-neutral-500">Reduced</span>
                  </div>
                  {assets.filter(a => a.type === "Debt" && a.change24h && a.change24h < 0).length > 0 ? (
                    <div className="text-lg font-bold text-emerald-400">
                      {Math.abs(assets.filter(a => a.type === "Debt").reduce((sum, a) => sum + (a.change24h || 0), 0)).toFixed(1)}%
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-neutral-600">0%</div>
                  )}
                </div>
              </div>
              
              {/* Progress indicator if debts are being reduced */}
              {assets.filter(a => a.type === "Debt" && a.previousValue && a.previousValue > a.value).length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span>Paydown Progress</span>
                    <span className="text-emerald-400">On track</span>
                  </div>
                  <div className="h-2 bg-neutral-800/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(assets.filter(a => a.type === "Debt").reduce((sum, a) => sum + (a.change24h || 0), 0)) * 10, 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assets List - Tall Card */}
        <Card className="md:col-span-2 lg:col-span-3 row-span-2 bg-neutral-900/40 border-white/5">
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Group assets by type */}
              {Array.from(new Set(assets.map(a => a.type))).map((assetType) => {
                const assetsOfType = assets.filter(a => a.type === assetType)
                
                return (
                  <div key={assetType} className="space-y-3">
                    {/* Category Header */}
                    <div 
                      className="flex items-center justify-between pb-2 border-b border-white/5 cursor-pointer hover:border-white/10 transition-colors group"
                      onClick={() => toggleCategory(assetType)}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider group-hover:text-white transition-colors">{assetType}</h3>
                        <span className="text-xs text-neutral-500">({assetsOfType.length})</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${collapsedCategories.has(assetType) ? "-rotate-90" : ""}`} />
                    </div>
                    
                    {/* Assets in this category */}
                    {!collapsedCategories.has(assetType) && (
                      <div className="space-y-2">
                      {assetsOfType.map((asset, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={asset.id} 
                          className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                        >
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg font-bold text-neutral-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                            {asset.name.charAt(0)}
                          </div>
                          <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none text-white">{asset.name}</p>
                            <p className="text-xs text-neutral-500 group-hover:text-neutral-400">
                              {asset.type}
                            </p>
                          </div>
                          <div className="text-right mr-4">
                            <div className="font-medium text-white">${asset.value.toLocaleString()}</div>
                            
                            {/* Stock-specific gain/loss */}
                            {asset.type === "Stocks" && asset.shares && asset.averagePrice && asset.currentPrice && (
                              <div className={`flex items-center justify-end gap-1 text-xs ${
                                asset.currentPrice >= asset.averagePrice ? "text-emerald-400" : "text-red-400"
                              }`}>
                                <TrendingUp className={`w-3 h-3 ${asset.currentPrice < asset.averagePrice ? "rotate-180" : ""}`} />
                                <span>
                                  {asset.currentPrice >= asset.averagePrice ? "+" : ""}
                                  ${((asset.currentPrice - asset.averagePrice) * asset.shares).toFixed(2)} 
                                  ({(((asset.currentPrice - asset.averagePrice) / asset.averagePrice) * 100).toFixed(2)}%)
                                </span>
                              </div>
                            )}
                            
                            {/* Vehicle-specific depreciation */}
                            {asset.type === "Vehicles" && asset.purchasePrice && asset.resaleValue && (
                              <div className={`flex items-center justify-end gap-1 text-xs ${
                                asset.resaleValue >= asset.purchasePrice ? "text-emerald-400" : "text-red-400"
                              }`}>
                                <TrendingUp className={`w-3 h-3 ${asset.resaleValue < asset.purchasePrice ? "rotate-180" : ""}`} />
                                <span>
                                  {asset.resaleValue >= asset.purchasePrice ? "+" : ""}
                                  ${(asset.resaleValue - asset.purchasePrice).toFixed(2)} 
                                  ({(((asset.resaleValue - asset.purchasePrice) / asset.purchasePrice) * 100).toFixed(2)}%)
                                </span>
                              </div>
                            )}
                            
                            {/* Regular percentage change for non-stocks/vehicles or assets without detailed data */}
                            {asset.type !== "Stocks" && asset.type !== "Vehicles" && asset.change24h !== undefined && asset.change24h !== 0 && (
                              <div className={`flex items-center justify-end gap-1 text-xs ${
                                asset.type === "Debt" 
                                  ? (asset.change24h < 0 ? "text-emerald-400" : "text-red-400") // For debt, negative is good (reduction)
                                  : (asset.change24h >= 0 ? "text-emerald-400" : "text-red-400") // For assets, positive is good
                              }`}>
                                {asset.type === "Debt" ? (
                                  asset.change24h < 0 ? (
                                    <>
                                      <TrendingUp className="w-3 h-3 rotate-180" />
                                      <span>{Math.abs(asset.change24h).toFixed(2)}% reduced</span>
                                    </>
                                  ) : (
                                    <>
                                      <TrendingUp className="w-3 h-3" />
                                      <span>+{asset.change24h.toFixed(2)}% increased</span>
                                    </>
                                  )
                                ) : (
                                  asset.change24h >= 0 ? (
                                    <>
                                      <TrendingUp className="w-3 h-3" />
                                      <span>+{asset.change24h.toFixed(2)}%</span>
                                    </>
                                  ) : (
                                    <>
                                      <TrendingUp className="w-3 h-3 rotate-180" />
                                      <span>{asset.change24h.toFixed(2)}%</span>
                                    </>
                                  )
                                )}
                              </div>
                            )}
                            
                            {/* No change indicator */}
                            {asset.type !== "Stocks" && asset.type !== "Vehicles" && (asset.change24h === undefined || asset.change24h === 0) && (
                              <div className="text-xs text-neutral-600">No change</div>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400"
                              onClick={() => setEditingAsset(asset)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
                                  removeAsset(asset.id)
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    )}
                  </div>
                )
              })}
              
              {assets.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  No assets found. Add one to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Allocation Visualization - Square Card */}
        <Card className="lg:col-span-1 row-span-2 bg-gradient-to-br from-neutral-900/60 to-neutral-900/20 border-white/5 flex flex-col overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Mix</CardTitle>
            <p className="text-xs text-neutral-500 mt-1">Asset distribution</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10">
             {assets.filter(a => a.type !== "Debt").length > 0 ? (
               <div className="w-full space-y-6">
                 {/* Donut Chart */}
                 <div className="relative w-48 h-48 mx-auto">
                   <svg viewBox="0 0 200 200" className="transform -rotate-90">
                     {(() => {
                       const assetTypes = Array.from(new Set(assets.filter(a => a.type !== "Debt").map(a => a.type)))
                       const gradients = [
                         { id: "grad1", from: "#3b82f6", to: "#06b6d4" },
                         { id: "grad2", from: "#a855f7", to: "#ec4899" },
                         { id: "grad3", from: "#ec4899", to: "#f43f5e" },
                         { id: "grad4", from: "#f97316", to: "#f59e0b" },
                         { id: "grad5", from: "#10b981", to: "#14b8a6" },
                         { id: "grad6", from: "#06b6d4", to: "#3b82f6" },
                       ]
                       
                       let currentAngle = 0
                       const radius = 80
                       const centerX = 100
                       const centerY = 100
                       const strokeWidth = 28
                       
                       return (
                         <>
                           {/* Define gradients */}
                           <defs>
                             {gradients.map(grad => (
                               <linearGradient key={grad.id} id={grad.id} x1="0%" y1="0%" x2="100%" y2="100%">
                                 <stop offset="0%" stopColor={grad.from} />
                                 <stop offset="100%" stopColor={grad.to} />
                               </linearGradient>
                             ))}
                           </defs>
                           
                           {/* Background circle */}
                           <circle
                             cx={centerX}
                             cy={centerY}
                             r={radius}
                             fill="none"
                             stroke="rgba(255,255,255,0.05)"
                             strokeWidth={strokeWidth}
                           />
                           
                           {/* Segments */}
                           {assetTypes.map((type, i) => {
                             const typeAssets = assets.filter(a => a.type === type)
                             const typeValue = typeAssets.reduce((sum, a) => sum + a.value, 0)
                             const percentage = totalValue > 0 ? (typeValue / totalValue) * 100 : 0
                             const angle = (percentage / 100) * 360
                             
                             const startAngle = currentAngle
                             const endAngle = currentAngle + angle
                             currentAngle = endAngle
                             
                             const startRad = (startAngle - 90) * (Math.PI / 180)
                             const endRad = (endAngle - 90) * (Math.PI / 180)
                             
                             const x1 = centerX + radius * Math.cos(startRad)
                             const y1 = centerY + radius * Math.sin(startRad)
                             const x2 = centerX + radius * Math.cos(endRad)
                             const y2 = centerY + radius * Math.sin(endRad)
                             
                             const largeArc = angle > 180 ? 1 : 0
                             
                             const pathData = `
                               M ${x1} ${y1}
                               A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                             `
                             
                             return (
                               <motion.path
                                 key={type}
                                 d={pathData}
                                 fill="none"
                                 stroke={`url(#${gradients[i % gradients.length].id})`}
                                 strokeWidth={strokeWidth}
                                 strokeLinecap="round"
                                 initial={{ pathLength: 0, opacity: 0 }}
                                 animate={{ pathLength: 1, opacity: 1 }}
                                 transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                               />
                             )
                           })}
                         </>
                       )
                     })()}
                   </svg>
                   
                   {/* Center text */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="text-3xl font-bold text-white">{assets.filter(a => a.type !== "Debt").length}</div>
                     <div className="text-xs text-neutral-500">Assets</div>
                   </div>
                 </div>
                 
                 {/* Legend */}
                 <div className="space-y-2">
                   {Array.from(new Set(assets.filter(a => a.type !== "Debt").map(a => a.type))).map((type, i) => {
                     const typeAssets = assets.filter(a => a.type === type)
                     const typeValue = typeAssets.reduce((sum, a) => sum + a.value, 0)
                     const percentage = totalValue > 0 ? (typeValue / totalValue) * 100 : 0
                     const gradients = [
                       "from-blue-500 to-cyan-500",
                       "from-purple-500 to-pink-500",
                       "from-pink-500 to-rose-500",
                       "from-orange-500 to-amber-500",
                       "from-emerald-500 to-teal-500",
                       "from-cyan-500 to-blue-500",
                     ]
                     const gradient = gradients[i % gradients.length]
                     
                     return (
                       <motion.div
                         key={type}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.5 + i * 0.1 }}
                         className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-colors"
                       >
                         <div className="flex items-center gap-2 flex-1">
                           <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`}></div>
                           <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{type}</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="text-xs text-neutral-600">${(typeValue / 1000).toFixed(1)}k</span>
                           <span className="text-sm font-semibold text-white min-w-[3rem] text-right">{percentage.toFixed(1)}%</span>
                         </div>
                       </motion.div>
                     )
                   })}
                 </div>
               </div>
             ) : (
               <div className="text-center text-neutral-500 py-12 text-sm">
                 <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-neutral-800/50 flex items-center justify-center">
                   <Wallet className="w-8 h-8 text-neutral-600" />
                 </div>
                 Add assets to see allocation
               </div>
             )}
          </CardContent>
        </Card>

      </div>

      {editingAsset && (
        <EditAssetModal 
          asset={editingAsset} 
          onClose={() => setEditingAsset(null)} 
        />
      )}
    </div>
  )
}
