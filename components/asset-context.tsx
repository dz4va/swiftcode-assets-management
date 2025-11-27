"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type AssetType = "Real Estate" | "Stocks" | "Crypto" | "Private Equity" | "Cash" | "Collectibles" | "Vehicles" | "Debt" | "Other"

export interface Asset {
  id: string
  name: string
  type: AssetType
  value: number
  previousValue?: number // Track previous value to calculate change percentage
  currency: string
  change24h?: number // Calculated percentage change from previousValue
  monthlyPayment?: number // For debts - monthly payment amount
  loanStartDate?: string // For debts - when the loan started (ISO date string)
  
  // Stock-specific fields
  shares?: number // Number of shares owned
  averagePrice?: number // Average purchase price per share
  currentPrice?: number // Current market price per share
  totalInvested?: number // Total amount invested (shares * averagePrice)
  
  // Vehicle-specific fields
  purchasePrice?: number // Original purchase price
  resaleValue?: number // Current estimated resale value
  
  // Real Estate-specific fields
  linkedDebtId?: string // ID of the linked debt/mortgage
  totalPaid?: number // Total amount paid towards mortgage so far
  isRented?: boolean // Whether the property is rented out
  monthlyRent?: number // Monthly rental income
  rentalStartDate?: string // When renting started (ISO date string)
}

interface AssetContextType {
  assets: Asset[]
  addAsset: (asset: Omit<Asset, "id">) => void
  updateAsset: (id: string, asset: Partial<Omit<Asset, "id">>) => void
  removeAsset: (id: string) => void
  totalValue: number
  totalDebt: number
  totalMonthlyPayments: number
  netWorth: number
  getAssetsByType: (type: AssetType) => Asset[]
}

const AssetContext = createContext<AssetContextType | undefined>(undefined)

const STORAGE_KEY = "asseta_assets"
const DEFAULT_ASSETS: Asset[] = [
  { id: "1", name: "Tesla Inc.", type: "Stocks", value: 25000, currency: "USD", change24h: 2.5 },
  { id: "2", name: "Downtown Apartment", type: "Real Estate", value: 450000, currency: "USD", change24h: 0.1 },
  { id: "3", name: "Bitcoin", type: "Crypto", value: 12000, currency: "USD", change24h: -1.2 },
]

export function AssetProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setAssets(JSON.parse(stored))
      } else {
        setAssets(DEFAULT_ASSETS)
      }
    } catch (error) {
      console.error("Failed to load assets from localStorage:", error)
      setAssets(DEFAULT_ASSETS)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever assets change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
      } catch (error) {
        console.error("Failed to save assets to localStorage:", error)
      }
    }
  }, [assets, isLoaded])

  const addAsset = (asset: Omit<Asset, "id">) => {
    const newAsset = { 
      ...asset, 
      id: Math.random().toString(36).substr(2, 9),
      previousValue: asset.value, // Set initial previousValue
      change24h: 0 // New assets start with 0% change
    }
    setAssets((prev) => [...prev, newAsset])
  }

  const updateAsset = (id: string, updates: Partial<Omit<Asset, "id">>) => {
    setAssets((prev) => prev.map((a) => {
      if (a.id === id) {
        // If value is being updated, calculate percentage change
        if (updates.value !== undefined && updates.value !== a.value) {
          const previousValue = a.value
          const newValue = updates.value
          const percentageChange = previousValue > 0 
            ? ((newValue - previousValue) / previousValue) * 100 
            : 0
          
          return {
            ...a,
            ...updates,
            previousValue,
            change24h: percentageChange
          }
        }
        return { ...a, ...updates }
      }
      return a
    }))
  }

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }

  // Calculate assets (excluding debts)
  const totalValue = assets
    .filter((asset) => asset.type !== "Debt")
    .reduce((sum, asset) => sum + asset.value, 0)

  // Calculate total debt
  const totalDebt = assets
    .filter((asset) => asset.type === "Debt")
    .reduce((sum, asset) => sum + asset.value, 0)

  // Calculate total monthly payments
  const totalMonthlyPayments = assets
    .filter((asset) => asset.type === "Debt")
    .reduce((sum, asset) => sum + (asset.monthlyPayment || 0), 0)

  // Calculate net worth (assets - debts)
  const netWorth = totalValue - totalDebt

  const getAssetsByType = (type: AssetType) => assets.filter((a) => a.type === type)

  return (
    <AssetContext.Provider value={{ assets, addAsset, updateAsset, removeAsset, totalValue, totalDebt, totalMonthlyPayments, netWorth, getAssetsByType }}>
      {children}
    </AssetContext.Provider>
  )
}

export function useAssets() {
  const context = useContext(AssetContext)
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetProvider")
  }
  return context
}
