'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PlanCard from '@/components/PlanCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTravelStore } from '@/lib/store';
import { selectPlan } from '@/lib/api';
import { motion } from 'framer-motion';

export default function PlansPage() {
    const router = useRouter();
    const params = useParams();
    const { itinerary, setItinerary, setLoading, loading, selectedPlanId, setSelectedPlanId } = useTravelStore();
    const [submitting, setSubmitting] = useState(false);

    if (!itinerary) return <LoadingSpinner />;

    const handleSelectPlan = async () => {
        if (!selectedPlanId) {
            alert('Please select a plan');
            return;
        }

        setSubmitting(true);
        try {
            const result = await selectPlan(itinerary._id, selectedPlanId);

            // Update the itinerary with detailed plan
            const updatedItinerary = {
                ...itinerary,
                detailedPlan: result.detailedPlan,
                selectedPlanId
            };
            setItinerary(updatedItinerary);

            router.push(`/details/${itinerary._id}`);
        } catch (error) {
            alert('Error selecting plan');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {itinerary.fromCity} → {itinerary.toCity}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {itinerary.durationDays} days • {itinerary.profileType.join(', ')} • Budget: <span className="font-bold capitalize text-blue-600">{itinerary.budget}</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Perfect Plan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {itinerary.plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isSelected={selectedPlanId === plan.id}
                                onSelect={() => setSelectedPlanId(plan.id)}
                            />
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleSelectPlan}
                        disabled={!selectedPlanId || submitting}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                    >
                        {submitting ? '⏳ Processing...' : '✨ Continue with Selected Plan'}
                    </motion.button>
                </motion.div>
            </div>
        </main>
    );
}
