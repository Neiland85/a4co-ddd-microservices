"use client"

import { useState, useEffect } from "react"

export function useSectionTransition(activeSection: string) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousSection, setPreviousSection] = useState(activeSection)

  useEffect(() => {
    if (activeSection !== previousSection) {
      setIsTransitioning(true)
      setPreviousSection(activeSection)

      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [activeSection, previousSection])

  return { isTransitioning, previousSection }
}
