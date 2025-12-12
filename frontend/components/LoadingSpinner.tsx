'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full"
            />
            <p className="mt-4 text-lg font-semibold text-gray-700">
                Generating your personalized itineraries...
            </p>
        </div>
    );
}
