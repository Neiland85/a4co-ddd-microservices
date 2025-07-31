"use client"

import { motion } from "framer-motion"

interface FormProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function FormProgress({ currentStep, totalSteps, stepLabels }: FormProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index <= currentStep ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? "✓" : index + 1}
            </motion.div>
            <span className={`text-xs ${index <= currentStep ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
