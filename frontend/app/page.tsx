'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="text-7xl mb-4">✈️</div>
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    AI Travel Planner
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-4">
                    Create personalized itineraries powered by AI
                </p>

                <p className="text-gray-500 mb-8 text-lg">
                    Get 3 unique travel plans tailored to your preferences, budget, and travel style
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <div className="text-center">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="font-semibold text-gray-900">Smart Planning</p>
                        <p className="text-sm text-gray-600">AI-powered recommendations</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">💰</div>
                        <p className="font-semibold text-gray-900">Budget Friendly</p>
                        <p className="text-sm text-gray-600">Plans for every budget</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">📱</div>
                        <p className="font-semibold text-gray-900">Easy to Use</p>
                        <p className="text-sm text-gray-600">Simple 3-step process</p>
                    </div>
                </div>

                <Link href="/itinerary">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition shadow-lg"
                    >
                        Start Planning Your Trip →
                    </motion.button>
                </Link>
            </motion.div>
        </main>
    );
}
