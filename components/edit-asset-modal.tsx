"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAssets, AssetType, Asset } from "@/components/asset-context"
import { X } from "lucide-react"

export function EditAssetModal({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const { updateAsset } = useAssets()
  const [name, setName] = useState(asset.name)
  const [value, setValue] = useState(asset.value.toString())
  const [type, setType] = useState<AssetType>(asset.type)
  const [monthlyPayment, setMonthlyPayment] = useState(asset.monthlyPayment?.toString() || "")
  
  // Stock-specific fields
  const [shares, setShares] = useState(asset.shares?.toString() || "")
  const [averagePrice, setAveragePrice] = useState(asset.averagePrice?.toString() || "")
  const [currentPrice, setCurrentPrice] = useState(asset.currentPrice?.toString() || "")
  
  // Vehicle-specific fields
  const [purchasePrice, setPurchasePrice] = useState(asset.purchasePrice?.toString() || "")
  const [resaleValue, setResaleValue] = useState(asset.resaleValue?.toString() || "")
  
  // Real Estate-specific fields
  const { assets } = useAssets()
  const [linkedDebtId, setLinkedDebtId] = useState(asset.linkedDebtId || "")
  const [totalPaid, setTotalPaid] = useState(asset.totalPaid?.toString() || "")
  const [isRented, setIsRented] = useState(asset.isRented || false)
  const [monthlyRent, setMonthlyRent] = useState(asset.monthlyRent?.toString() || "")

  // Auto-calculate value for stocks
  useEffect(() => {
    if (type === "Stocks" && shares && currentPrice) {
      const calculatedValue = parseFloat(shares) * parseFloat(currentPrice)
      setValue(calculatedValue.toString())
    }
  }, [shares, currentPrice, type])
  
  // Auto-set value for vehicles to resale value
  useEffect(() => {
    if (type === "Vehicles" && resaleValue) {
      setValue(resaleValue)
    }
  }, [resaleValue, type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updates: Partial<Omit<Asset, "id">> = {
      name,
      value: parseFloat(value),
      type,
    }

    // Add debt-specific fields
    if (type === "Debt" && monthlyPayment) {
      updates.monthlyPayment = parseFloat(monthlyPayment)
    } else {
      updates.monthlyPayment = undefined
    }

    // Add stock-specific fields
    if (type === "Stocks" && shares && averagePrice && currentPrice) {
      const sharesNum = parseFloat(shares)
      const avgPrice = parseFloat(averagePrice)
      const currPrice = parseFloat(currentPrice)
      
      updates.shares = sharesNum
      updates.averagePrice = avgPrice
      updates.currentPrice = currPrice
      updates.totalInvested = sharesNum * avgPrice
    } else {
      updates.shares = undefined
      updates.averagePrice = undefined
      updates.currentPrice = undefined
      updates.totalInvested = undefined
    }
    
    // Add vehicle-specific fields
    if (type === "Vehicles" && purchasePrice && resaleValue) {
      updates.purchasePrice = parseFloat(purchasePrice)
      updates.resaleValue = parseFloat(resaleValue)
    } else {
      updates.purchasePrice = undefined
      updates.resaleValue = undefined
    }
    
    // Add real estate-specific fields
    if (type === "Real Estate") {
      updates.linkedDebtId = linkedDebtId || undefined
      updates.totalPaid = totalPaid ? parseFloat(totalPaid) : undefined
      updates.isRented = isRented
      updates.monthlyRent = (isRented && monthlyRent) ? parseFloat(monthlyRent) : undefined
    } else {
      updates.linkedDebtId = undefined
      updates.totalPaid = undefined
      updates.isRented = undefined
      updates.monthlyRent = undefined
    }

    updateAsset(asset.id, updates)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-neutral-900 border-blue-500/30 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            {type === "Debt" ? "Edit Debt" : type === "Stocks" ? "Edit Stock Investment" : "Edit Asset"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                <Input 
                  id="edit-name" 
                  placeholder={type === "Debt" ? "e.g. Mortgage" : type === "Stocks" ? "e.g. AAPL" : "e.g. Asset Name"} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="bg-neutral-950"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-type" className="text-sm font-medium">Type</label>
                <select 
                  id="edit-type" 
                  className="flex h-10 w-full rounded-md border border-input bg-neutral-950 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={type}
                  onChange={(e) => setType(e.target.value as AssetType)}
                >
                  <option value="Real Estate">Real Estate</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Private Equity">Private Equity</option>
                  <option value="Cash">Cash</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Debt">Debt</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {type !== "Stocks" && type !== "Vehicles" && (
                <div className="grid gap-2">
                  <label htmlFor="edit-value" className="text-sm font-medium">
                    {type === "Debt" ? "Amount Owed (USD)" : "Value (USD)"}
                  </label>
                  <Input 
                    id="edit-value" 
                    type="number" 
                    placeholder="0.00" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                    required 
                    className="bg-neutral-950"
                  />
                </div>
              )}
            </div>

            {/* Stock-specific fields */}
            {type === "Stocks" && (
              <div className="grid gap-4 md:grid-cols-4 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="grid gap-2">
                  <label htmlFor="edit-shares" className="text-sm font-medium">Shares</label>
                  <Input 
                    id="edit-shares" 
                    type="number" 
                    step="0.01"
                    placeholder="100" 
                    value={shares} 
                    onChange={(e) => setShares(e.target.value)} 
                    required 
                    className="bg-neutral-950"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-averagePrice" className="text-sm font-medium">Avg Price</label>
                  <Input 
                    id="edit-averagePrice" 
                    type="number" 
                    step="0.01"
                    placeholder="150.00" 
                    value={averagePrice} 
                    onChange={(e) => setAveragePrice(e.target.value)} 
                    required 
                    className="bg-neutral-950"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-currentPrice" className="text-sm font-medium">Current Price</label>
                  <Input 
                    id="edit-currentPrice" 
                    type="number" 
                    step="0.01"
                    placeholder="175.00" 
                    value={currentPrice} 
                    onChange={(e) => setCurrentPrice(e.target.value)} 
                    required 
                    className="bg-neutral-950"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-neutral-400">Total Value</label>
                  <div className="h-10 flex items-center px-3 bg-neutral-950 rounded-md border border-input text-emerald-400 font-medium">
                    ${value ? parseFloat(value).toLocaleString() : "0"}
                  </div>
                </div>
                {shares && averagePrice && currentPrice && (
                  <div className="col-span-4 p-3 bg-neutral-950/50 rounded-lg border border-white/5">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-400">Total Invested</div>
                        <div className="text-white font-medium">${(parseFloat(shares) * parseFloat(averagePrice)).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-neutral-400">Current Value</div>
                        <div className="text-white font-medium">${(parseFloat(shares) * parseFloat(currentPrice)).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-neutral-400">Gain/Loss</div>
                        <div className={`font-medium ${
                          (parseFloat(shares) * parseFloat(currentPrice)) >= (parseFloat(shares) * parseFloat(averagePrice)) 
                            ? "text-emerald-400" 
                            : "text-red-400"
                        }`}>
                          ${((parseFloat(shares) * parseFloat(currentPrice)) - (parseFloat(shares) * parseFloat(averagePrice))).toLocaleString()} 
                          ({(((parseFloat(currentPrice) - parseFloat(averagePrice)) / parseFloat(averagePrice)) * 100).toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Vehicle-specific fields */}
            {type === "Vehicles" && (
              <div className="grid gap-4 md:grid-cols-3 p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div className="grid gap-2">
                  <label htmlFor="edit-purchasePrice" className="text-sm font-medium">Purchase Price</label>
                  <Input 
                    id="edit-purchasePrice" 
                    type="number" 
                    step="0.01"
                    placeholder="25000.00" 
                    value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(e.target.value)} 
                    required 
                    className="bg-neutral-950"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-resaleValue" className="text-sm font-medium">Current Resale Value</label>
                  <Input 
                    id="edit-resaleValue" 
                    type="number" 
                    step="0.01"
                    placeholder="22000.00" 
                    value={resaleValue} 
                    onChange={(e) => setResaleValue(e.target.value)} 
                    required 
                    className="bg-neutral-950"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-neutral-400">Depreciation</label>
                  <div className={`h-10 flex items-center px-3 bg-neutral-950 rounded-md border border-input font-medium ${
                    purchasePrice && resaleValue && parseFloat(resaleValue) < parseFloat(purchasePrice) 
                      ? "text-red-400" 
                      : "text-emerald-400"
                  }`}>
                    {purchasePrice && resaleValue 
                      ? `${parseFloat(resaleValue) >= parseFloat(purchasePrice) ? "+" : ""}$${(parseFloat(resaleValue) - parseFloat(purchasePrice)).toLocaleString()}`
                      : "$0"}
                  </div>
                </div>
              </div>
            )}

            {/* Real Estate-specific fields */}
            {type === "Real Estate" && (
              <div className="space-y-4 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="text-sm font-semibold text-green-400">Property Details</div>
                
                {/* Linked Debt */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Link to Mortgage/Debt (Optional)</label>
                  <select
                    value={linkedDebtId}
                    onChange={(e) => setLinkedDebtId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-input rounded-md text-white text-sm"
                  >
                    <option value="">No linked debt</option>
                    {assets.filter(a => a.type === "Debt" && a.id !== asset.id).map(debt => (
                      <option key={debt.id} value={debt.id}>{debt.name} - ${debt.value.toLocaleString()}</option>
                    ))}
                  </select>
                </div>
                
                {/* Total Paid */}
                {linkedDebtId && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Total Paid So Far</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="50000.00"
                      value={totalPaid}
                      onChange={(e) => setTotalPaid(e.target.value)}
                      className="bg-neutral-950"
                    />
                    {totalPaid && linkedDebtId && (() => {
                      const linkedDebt = assets.find(a => a.id === linkedDebtId)
                      if (linkedDebt) {
                        const originalAmount = linkedDebt.value + parseFloat(totalPaid)
                        const progress = (parseFloat(totalPaid) / originalAmount) * 100
                        return (
                          <div className="text-xs text-emerald-400 mt-1">
                            Progress: {progress.toFixed(1)}% paid (${parseFloat(totalPaid).toLocaleString()} / ${originalAmount.toLocaleString()})
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                )}
                
                {/* Rental Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-isRented"
                      checked={isRented}
                      onChange={(e) => setIsRented(e.target.checked)}
                      className="w-4 h-4 rounded border-input bg-neutral-950 text-blue-500"
                    />
                    <label htmlFor="edit-isRented" className="text-sm font-medium">Property is rented out</label>
                  </div>
                  
                  {isRented && (
                    <div className="grid gap-2 pl-6">
                      <label className="text-sm font-medium">Monthly Rental Income</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="2000.00"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                        className="bg-neutral-950"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Debt-specific field */}
            {type === "Debt" && (
              <div className="grid gap-2">
                <label htmlFor="edit-monthlyPayment" className="text-sm font-medium">Monthly Payment</label>
                <Input 
                  id="edit-monthlyPayment" 
                  type="number" 
                  placeholder="0.00" 
                  value={monthlyPayment} 
                  onChange={(e) => setMonthlyPayment(e.target.value)} 
                  className="bg-neutral-950"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="premium">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
