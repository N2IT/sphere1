'use client'

import { useEffect, useState, useRef } from 'react'
import { ThreeScene } from './components/three-scene'
import { Terminal } from './components/terminal'
import { motion, AnimatePresence } from 'framer-motion'

export function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isZoomedOut, setIsZoomedOut] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGetStarted = () => {
    setIsZoomedOut(true)
    // Delay showing terminal until animations are complete
    setTimeout(() => setShowTerminal(true), 5000)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Scene Container */}
      <div className="absolute inset-0">
        <ThreeScene isZoomedOut={isZoomedOut} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {!showTerminal ? (
            <motion.div 
              key="title-section"
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl tracking-[0.3em] font-light text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isZoomedOut ? 0 : 1 }}
                transition={{ duration: 1, delay: isZoomedOut ? 0 : 0.05 }}
              >
                TONY EDER
              </motion.h1>
              <motion.p 
                className="text-sm md:text-base tracking-[0.6em] text-blue-200/80 uppercase mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: isZoomedOut ? 0 : 1 }}
                transition={{ duration: 1, delay: isZoomedOut ? 0.2 : 0.7 }}
              >
                Developer | Sci-Fi Aficionado
              </motion.p>
              <motion.button
                onClick={handleGetStarted}
                className="px-6 py-2 text-sm tracking-[0.2em] text-blue-200/80 border border-blue-200/30 rounded-lg
                         hover:bg-blue-200/10 hover:border-blue-200/50 transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: isZoomedOut ? 0 : 1 }}
                transition={{ duration: 1, delay: isZoomedOut ? 0.4 : 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GET STARTED
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              className="w-full max-w-4xl px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Terminal />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

