'use client';

import { motion } from 'framer-motion';

interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center flex-1">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
              ${i < currentStep ? 'bg-green-500 text-white' : ''}
              ${i === currentStep ? 'bg-blue-500 text-white ring-2 ring-blue-300' : ''}
              ${i > currentStep ? 'bg-gray-300 text-gray-600' : ''}
            `}
                    >
                        {i + 1}
                    </motion.div>
                    {i < totalSteps - 1 && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: i < currentStep ? '100%' : '0%' }}
                            className="h-1 bg-green-500 mx-2"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
