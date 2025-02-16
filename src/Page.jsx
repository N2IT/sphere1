'use client'

import { useEffect, useState } from 'react'
import { ThreeScene } from './components/three-scene'
import { motion } from 'framer-motion'

export function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isZoomedOut, setIsZoomedOut] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGetStarted = () => {
    setIsZoomedOut(true)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Scene Container */}
      <div className="absolute inset-0">
        <ThreeScene isZoomedOut={isZoomedOut} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light text-white mb-4">
            TONY EDER
          </h1>
          <p className="text-sm md:text-base tracking-[0.6em] text-blue-200/80 uppercase mb-8">
            Developer | Sci-Fi Aficionado
          </p>
          <motion.button
            onClick={handleGetStarted}
            className="px-6 py-2 text-sm tracking-[0.2em] text-blue-200/80 border border-blue-200/30 rounded-lg
                     hover:bg-blue-200/10 hover:border-blue-200/50 transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GET STARTED
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

