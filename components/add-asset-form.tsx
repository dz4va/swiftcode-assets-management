"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssets, AssetType } from "@/components/asset-context"
import { X, TrendingUp, Home, DollarSign, Car } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AddAssetForm({ onClose }: { onClose: () => void }) {
  const { addAsset } = useAssets()
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [type, setType] = useState<AssetType>("Stocks")
  const [monthlyPayment, setMonthlyPayment] = useState("")
  
  // Stock-specific fields
  const [shares, setShares] = useState("")
  const [averagePrice, setAveragePrice] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  
  // Vehicle-specific fields
  const [purchasePrice, setPurchasePrice] = useState("")
  const [resaleValue, setResaleValue] = useState("")
  
  // Real Estate-specific fields
  const { assets } = useAssets()
  const [linkedDebtId, setLinkedDebtId] = useState("")
  const [totalPaid, setTotalPaid] = useState("")
  const [isRented, setIsRented] = useState(false)
  const [monthlyRent, setMonthlyRent] = useState("")
  const [rentalStartDate, setRentalStartDate] = useState("")
  
  // Debt-specific date field
  const [loanStartDate, setLoanStartDate] = useState("")

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
    
    const baseAsset = {
      name,
      value: parseFloat(value),
      type,
      currency: "USD",
      change24h: 0,
    }

    // Add debt-specific fields
    if (type === "Debt") {
      if (monthlyPayment) Object.assign(baseAsset, { monthlyPayment: parseFloat(monthlyPayment) })
      if (loanStartDate) Object.assign(baseAsset, { loanStartDate })
    }

    // Add stock-specific fields
    if (type === "Stocks" && shares && averagePrice && currentPrice) {
      const sharesNum = parseFloat(shares)
      const avgPrice = parseFloat(averagePrice)
      const currPrice = parseFloat(currentPrice)
      
      Object.assign(baseAsset, {
        shares: sharesNum,
        averagePrice: avgPrice,
        currentPrice: currPrice,
        totalInvested: sharesNum * avgPrice,
      })
    }
    
    // Add vehicle-specific fields
    if (type === "Vehicles" && purchasePrice && resaleValue) {
      Object.assign(baseAsset, {
        purchasePrice: parseFloat(purchasePrice),
        resaleValue: parseFloat(resaleValue),
      })
    }
    
    // Add real estate-specific fields
    if (type === "Real Estate") {
      const reFields: any = {}
      if (linkedDebtId) reFields.linkedDebtId = linkedDebtId
      if (totalPaid) reFields.totalPaid = parseFloat(totalPaid)
      if (isRented) {
        reFields.isRented = true
        if (monthlyRent) reFields.monthlyRent = parseFloat(monthlyRent)
        if (rentalStartDate) reFields.rentalStartDate = rentalStartDate
      }
      Object.assign(baseAsset, reFields)
    }

    addAsset(baseAsset)
    onClose()
  }

  const assetTypes: { value: AssetType; label: string; icon: any }[] = [
    { value: "Stocks", label: "Stocks", icon: TrendingUp },
    { value: "Real Estate", label: "Real Estate", icon: Home },
    { value: "Vehicles", label: "Vehicles", icon: Car },
    { value: "Crypto", label: "Crypto", icon: DollarSign },
    { value: "Debt", label: "Debt", icon: DollarSign },
    { value: "Other", label: "Other", icon: DollarSign },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Header */}
          <div className="sticky top-0 bg-neutral-900/95 backdrop-blur-xl border-b border-white/10 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Add New Asset</h2>
                <p className="text-sm text-neutral-400 mt-1">Track your wealth in one place</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
            {/* Asset Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300">Asset Type</label>
              <div className="grid grid-cols-3 gap-3">
                {assetTypes.map((assetType) => {
                  const Icon = assetType.icon
                  return (
                    <button
                      key={assetType.value}
                      type="button"
                      onClick={() => setType(assetType.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        type === assetType.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-2 ${type === assetType.value ? "text-blue-400" : "text-neutral-400"}`} />
                      <div className={`text-sm font-medium ${type === assetType.value ? "text-white" : "text-neutral-400"}`}>
                        {assetType.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Name</label>
                <Input
                  placeholder={type === "Stocks" ? "e.g. AAPL" : type === "Vehicles" ? "e.g. Tesla Model 3" : "Asset name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-neutral-800/50 border-white/10 text-white placeholder:text-neutral-500"
                />
              </div>

              {type !== "Stocks" && type !== "Vehicles" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">
                    {type === "Debt" ? "Amount Owed" : "Value"}
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    className="bg-neutral-800/50 border-white/10 text-white placeholder:text-neutral-500"
                  />
                </div>
              )}
            </div>

            {/* Stock-specific fields */}
            {type === "Stocks" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20"
              >
                <div className="text-sm font-medium text-blue-400 mb-3">Stock Details</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Shares</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="100"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      required
                      className="bg-neutral-800/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Avg Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="150.00"
                      value={averagePrice}
                      onChange={(e) => setAveragePrice(e.target.value)}
                      required
                      className="bg-neutral-800/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Current Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="175.00"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      required
                      className="bg-neutral-800/50 border-white/10 text-white"
                    />
                  </div>
                </div>
                {shares && currentPrice && (
                  <div className="text-sm text-neutral-400">
                    Total Value: <span className="text-emerald-400 font-semibold">${(parseFloat(shares) * parseFloat(currentPrice)).toLocaleString()}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Vehicle-specific fields */}
            {type === "Vehicles" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-orange-500/5 rounded-xl border border-orange-500/20"
              >
                <div className="text-sm font-medium text-orange-400 mb-3">Vehicle Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Purchase Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="25000.00"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      required
                      className="bg-neutral-800/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Current Resale Value</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="22000.00"
                      value={resaleValue}
                      onChange={(e) => setResaleValue(e.target.value)}
                      required
                      className="bg-neutral-800/50 border-white/10 text-white"
                    />
                  </div>
                </div>
                {purchasePrice && resaleValue && (
                  <div className={`text-sm ${parseFloat(resaleValue) >= parseFloat(purchasePrice) ? "text-emerald-400" : "text-red-400"}`}>
                    {parseFloat(resaleValue) >= parseFloat(purchasePrice) ? "+" : ""}${(parseFloat(resaleValue) - parseFloat(purchasePrice)).toLocaleString()} 
                    ({(((parseFloat(resaleValue) - parseFloat(purchasePrice)) / parseFloat(purchasePrice)) * 100).toFixed(1)}%)
                  </div>
                )}
              </motion.div>
            )}

            {/* Real Estate-specific fields */}
            {type === "Real Estate" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-green-500/5 rounded-xl border border-green-500/20"
              >
                <div className="text-sm font-medium text-green-400 mb-3">Property Details</div>
                
                {/* Linked Debt */}
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Link to Mortgage/Debt (Optional)</label>
                  <select
                    value={linkedDebtId}
                    onChange={(e) => setLinkedDebtId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white text-sm"
                  >
                    <option value="">No linked debt</option>
                    {assets.filter(a => a.type === "Debt").map(debt => (
                      <option key={debt.id} value={debt.id}>{debt.name} - ${debt.value.toLocaleString()}</option>
                    ))}
                  </select>
                </div>
                
                {/* Total Paid */}
                {linkedDebtId && (
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Total Paid So Far</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="50000.00"
                      value={totalPaid}
                      onChange={(e) => setTotalPaid(e.target.value)}
                      className="bg-neutral-800/50 border-white/10 text-white"
                    />
                    {totalPaid && linkedDebtId && (() => {
                      const linkedDebt = assets.find(a => a.id === linkedDebtId)
                      if (linkedDebt) {
                        const originalAmount = linkedDebt.value + parseFloat(totalPaid)
                        const progress = (parseFloat(totalPaid) / originalAmount) * 100
                        return (
                          <div className="text-xs text-emerald-400">
                            Progress: {progress.toFixed(1)}% paid ({parseFloat(totalPaid).toLocaleString()} / ${originalAmount.toLocaleString()})
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
                      id="isRented"
                      checked={isRented}
                      onChange={(e) => setIsRented(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-neutral-800/50 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="isRented" className="text-sm text-neutral-300">Property is rented out</label>
                  </div>
                  
                  {isRented && (
                    <div className="space-y-2 pl-6">
                      <label className="text-xs text-neutral-400">Monthly Rental Income</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="2000.00"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                        className="bg-neutral-800/50 border-white/10 text-white"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Debt-specific field */}
            {type === "Debt" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-neutral-300">Monthly Payment</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  className="bg-neutral-800/50 border-white/10 text-white placeholder:text-neutral-500"
                />
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="premium"
                className="flex-1"
              >
                Add Asset
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
