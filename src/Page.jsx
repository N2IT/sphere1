'use client'

import { useEffect, useState } from 'react'
import { Navigation } from './components/navigation'
import { ThreeScene } from './components/three-scene'
import { motion } from 'framer-motion'

export function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 to-transparent z-0" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        {/* Three.js Scene */}
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Text content */}
        <motion.div 
          className="text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light mb-4">
            YOUR NAME
          </h1>
          <p className="text-sm md:text-base tracking-[0.6em] text-blue-200/80 uppercase">
            Creative | Technologist | Developer
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          className="absolute bottom-12 left-0 right-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <Navigation />
        </motion.div>
      </div>
    </main>
  )
}

