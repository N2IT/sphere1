'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function Terminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    {
      type: 'system',
      content: 'Welcome to the interactive terminal. Type "help" to see available commands.'
    }
  ])
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleCommand = (command) => {
    // Add user input to history
    setHistory(prev => [...prev, { type: 'user', content: command }])

    // Process command
    const response = processCommand(command)
    
    // Add system response to history
    setHistory(prev => [...prev, { type: 'system', content: response }])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input.trim().toLowerCase())
      setInput('')
    }
  }

  const processCommand = (command) => {
    switch (command) {
      case 'help':
        return `Available commands:
  - help: Show this help message
  - about: Learn more about me
  - experience: View my professional experience
  - projects: Browse my projects
  - contact: Get my contact information
  - clear: Clear the terminal`
      case 'clear':
        setHistory([])
        return ''
      case 'about':
        return 'Loading about section...' // We'll expand this later
      case 'experience':
        return 'Loading experience section...' // We'll expand this later
      case 'projects':
        return 'Loading projects section...' // We'll expand this later
      case 'contact':
        return 'Loading contact information...' // We'll expand this later
      default:
        return `Command not found: ${command}. Type "help" to see available commands.`
    }
  }

  return (
    <motion.div
      className="bg-black/50 backdrop-blur-sm border border-blue-200/20 rounded-lg p-4 w-full h-[60vh] 
                 font-mono text-sm text-blue-200/80 overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-blue-200/20 scrollbar-track-transparent"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.type === 'user' ? (
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">❯</span>
                <span>{entry.content}</span>
              </div>
            ) : (
              <div className="pl-4">{entry.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Input Line */}
      <div className="flex items-center">
        <span className="text-blue-400 mr-2">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0"
          spellCheck="false"
          autoComplete="off"
        />
      </div>
    </motion.div>
  )
} 