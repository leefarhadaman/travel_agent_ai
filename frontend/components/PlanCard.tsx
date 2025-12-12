'use client';

import { Plan } from '@/lib/types';
import { motion } from 'framer-motion';

interface PlanCardProps {
    plan: Plan;
    onSelect: () => void;
    isSelected: boolean;
}

export default function PlanCard({ plan, onSelect, isSelected }: PlanCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            onClick={onSelect}
            className={`
        p-6 rounded-2xl cursor-pointer border-2 transition-all
        ${isSelected
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }
      `}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{plan.id}</div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Est. Cost</div>
                    <div className="text-2xl font-bold text-green-600">
                        ₹{plan.estimated_total_cost.amount_min.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                        - ₹{plan.estimated_total_cost.amount_max.toLocaleString('en-IN')}
                    </div>
                </div>
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{plan.summary}</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {plan.suitability_tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {isSelected && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-center"
                >
                    ✓ Selected
                </motion.div>
            )}
        </motion.div>
    );
}
