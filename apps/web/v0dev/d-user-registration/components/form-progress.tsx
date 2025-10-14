'use client';

import { motion } from 'framer-motion';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function FormProgress({ currentStep, totalSteps, stepLabels }: FormProgressProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index <= currentStep ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? '✓' : index + 1}
            </motion.div>
            <span className={`text-xs ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
