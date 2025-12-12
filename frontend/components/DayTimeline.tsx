'use client';

import { DetailedDay } from '@/lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayTimelineProps {
    day: DetailedDay;
    isFirstDay?: boolean;
}

export default function DayTimeline({ day, isFirstDay = false }: DayTimelineProps) {
    const [expanded, setExpanded] = useState(isFirstDay);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <motion.button
                onClick={() => setExpanded(!expanded)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 hover:shadow-lg transition flex justify-between items-center"
                whileHover={{ scale: 1.02 }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-3xl">📅</span>
                    <h3 className="text-2xl font-bold text-left">{day.date_hint}</h3>
                </div>
                <motion.span
                    animate={{ rotate: expanded ? 180 : 0 }}
                    className="text-2xl"
                >
                    ▼
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                    >
                        {day.segments.map((segment, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="mb-6"
                            >
                                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 mb-4 flex items-center gap-3">
                                    <span className="text-2xl">
                                        {segment.segment_type === 'morning' && '🌅'}
                                        {segment.segment_type === 'afternoon' && '☀️'}
                                        {segment.segment_type === 'evening' && '🌆'}
                                        {segment.segment_type === 'night' && '🌙'}
                                    </span>
                                    <h4 className="font-bold text-lg text-blue-900 capitalize">
                                        {segment.segment_type} ({segment.time_range})
                                    </h4>
                                </div>

                                <div className="space-y-4 ml-4">
                                    {segment.steps.map((step, stepIdx) => (
                                        <motion.div
                                            key={stepIdx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: stepIdx * 0.1 }}
                                            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition border-l-4 border-blue-500"
                                        >
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {step.image_url && (
                                                    <img
                                                        src={step.image_url}
                                                        alt={step.name}
                                                        className="w-full md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                )}

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-bold text-blue-600 text-lg">{step.time}</p>
                                                            <p className="font-bold text-gray-900 text-lg">{step.name}</p>
                                                        </div>
                                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold text-sm">
                                                            ₹{step.cost_hint.amount_min.toLocaleString('en-IN')}–₹{step.cost_hint.amount_max.toLocaleString('en-IN')}
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                                                    <div className="flex flex-wrap gap-3 text-xs">
                                                        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                                            <span>📍</span>
                                                            <span>{step.location.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                                            <span>⏱</span>
                                                            <span>{step.approx_duration_minutes} min</span>
                                                        </div>
                                                        {step.transport_from_previous.approx_minutes > 0 && (
                                                            <div className="flex items-center gap-1 text-blue-600 bg-blue-100 px-3 py-1 rounded-lg font-semibold">
                                                                <span>🚗</span>
                                                                <span>{step.transport_from_previous.mode} ({step.transport_from_previous.approx_minutes} min)</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
