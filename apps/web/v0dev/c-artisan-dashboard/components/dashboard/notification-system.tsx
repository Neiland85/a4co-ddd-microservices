"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning"
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        onRemove(notification.id)
      }, 5000)

      return () => clearTimeout(timer)
    })
  }, [notifications, onRemove])

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
            className={`p-4 rounded-lg border shadow-lg max-w-sm ${getColors(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemove(notification.id)} className="h-6 w-6 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
