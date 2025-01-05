'use client'

import { motion } from 'framer-motion'
import { Link } from '@nextui-org/react'

const navItems = [
  { name: 'WORK', href: '/work' },
  { name: 'PROTOTYPES', href: '/prototypes' },
  { name: 'ART', href: '/art' },
  { name: 'PRESS', href: '/press' },
  { name: 'INFO', href: '/info' },
  { name: 'REEL', href: '/reel' },
]

export function Navigation() {
  return (
    <nav className="flex justify-center items-center gap-8 md:gap-16">
      {navItems.map((item, index) => (
        <Link 
          key={item.name} 
          href={item.href}
          className="group relative"
        >
          <motion.span
            className="text-sm md:text-base text-blue-200/60 hover:text-white transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 1 }}
          >
            {item.name}
          </motion.span>
          <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-blue-400 transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </nav>
  )
}

