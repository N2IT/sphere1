'use client'

import { motion } from 'framer-motion'
import { Link } from '@nextui-org/react'

const navItems = [
  { name: 'ABOUT', href: '/about' },
  { name: 'EXPERIENCE', href: '/experience' },
  { name: 'PROJECTS', href: '/projects' },
  { name: 'BLOG', href: '/blog' },
  { name: 'CONTACT', href: '/contact' },
]

export function Navigation() {
  return (
    <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center items-center gap-8 md:gap-16">
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

