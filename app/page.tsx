"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Building2, Coins, Globe, PieChart, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-purple-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        {/* Aurora Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>The Future of Wealth Tracking is Here</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-500"
          >
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Digital Empire.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one dashboard for the modern investor. Track Real Estate, Stocks, Crypto, and Private Equity with unparalleled precision and style.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/login">
              <Button size="lg" variant="premium" className="h-14 px-10 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]">
                Start Tracking <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-sm">
              Live Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Everything You Own. <span className="text-neutral-500">One Interface.</span></h2>
            <p className="text-neutral-400 text-lg">Comprehensive tracking for every asset class in your portfolio.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Building2 className="w-8 h-8 text-blue-400" />}
              title="Real Estate"
              description="Track residential, commercial, and land properties with automated valuation updates."
              delay={0.1}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-pink-400" />}
              title="Stocks & ETFs"
              description="Real-time market data for global exchanges. Monitor your dividends and growth."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Coins className="w-8 h-8 text-yellow-400" />}
              title="Crypto & DeFi"
              description="Connect wallets or manually add holdings. Support for thousands of tokens."
              delay={0.3}
            />
            <FeatureCard 
              icon={<PieChart className="w-8 h-8 text-purple-400" />}
              title="Private Equity"
              description="Manage startup investments, angel shares, and private company holdings."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-cyan-400" />}
              title="Forex & Cash"
              description="Multi-currency support. Track cash flow and foreign exchange exposure."
              delay={0.5}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
              title="Collectibles"
              description="Art, watches, wine, and other alternative assets. Manual valuation tracking."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-neutral-950 text-center text-neutral-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
           <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xs">A</div>
           <span className="font-semibold tracking-tight">Asset A</span>
        </div>
        <p>&copy; 2024 Asset A. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="h-full bg-neutral-900/20 border-white/5 hover:border-white/10 hover:bg-neutral-900/40 transition-all group">
        <CardHeader>
          <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-white/10 shadow-lg">
            {icon}
          </div>
          <CardTitle className="text-2xl mb-2 group-hover:text-white transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-400 leading-relaxed text-base group-hover:text-neutral-300 transition-colors">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
