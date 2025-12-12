'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DayTimeline from '@/components/DayTimeline';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTravelStore } from '@/lib/store';
import { getItinerary } from '@/lib/api';
import { downloadItineraryPDF } from '@/lib/pdfGenerator';
import { motion } from 'framer-motion';
import '@/app/print.css';

export default function DetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { itinerary, setItinerary, loading, setLoading } = useTravelStore();
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchItinerary = async () => {
            setLoading(true);
            try {
                const data = await getItinerary(params.id as string);
                setItinerary(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (!itinerary?.detailedPlan) fetchItinerary();
    }, [params.id]);

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            await downloadItineraryPDF(itinerary!);
        } finally {
            setDownloading(false);
        }
    };

    const handleMakeAnother = () => {
        setItinerary(null as any);
        router.push('/itinerary');
    };

    if (loading || !itinerary?.detailedPlan) return <LoadingSpinner />;

    const totalCost = itinerary.detailedPlan.days.reduce((sum, day) => {
        return sum + day.segments.reduce((daySum, segment) => {
            return daySum + segment.steps.reduce((stepSum, step) => {
                return stepSum + step.cost_hint.amount_max;
            }, 0);
        }, 0);
    }, 0);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                    {itinerary.detailedPlan.title}
                                </h1>
                                <p className="text-lg md:text-xl opacity-90">
                                    {itinerary.fromCity} <span className="mx-2">→</span> {itinerary.toCity}
                                </p>
                            </div>
                            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-center">
                                <div className="text-sm opacity-80 mb-2">Estimated Total</div>
                                <div className="text-3xl md:text-4xl font-bold">
                                    ₹{totalCost.toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Trip Info Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <div className="text-3xl mb-2">📍</div>
                        <div className="text-sm text-gray-600 mb-1">From</div>
                        <div className="font-bold text-gray-900">{itinerary.fromCity}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-sm text-gray-600 mb-1">To</div>
                        <div className="font-bold text-gray-900">{itinerary.toCity}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <div className="text-3xl mb-2">📅</div>
                        <div className="text-sm text-gray-600 mb-1">Duration</div>
                        <div className="font-bold text-gray-900">{itinerary.durationDays} Days</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <div className="text-3xl mb-2">💰</div>
                        <div className="text-sm text-gray-600 mb-1">Budget</div>
                        <div className="font-bold text-gray-900 capitalize">{itinerary.budget}</div>
                    </div>
                </motion.div>

                {/* Travel Style Tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Travel Style</h3>
                    <div className="flex flex-wrap gap-3">
                        {itinerary.profileType.map((tag) => (
                            <motion.span
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg"
                            >
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Itinerary Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    id="itinerary-content"
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-12"
                >
                    <div className="print-header mb-12">
                        <h1 className="text-3xl font-bold text-blue-600 mb-2">
                            {itinerary.detailedPlan.title}
                        </h1>
                        <p className="text-gray-600">
                            {itinerary.fromCity} → {itinerary.toCity} • {itinerary.durationDays} Days
                        </p>
                    </div>

                    <div className="trip-overview mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Overview</h2>
                        <div className="overview-grid">
                            <div className="overview-item">
                                <strong>📍 From:</strong>
                                <p className="text-gray-700">{itinerary.fromCity}</p>
                            </div>
                            <div className="overview-item">
                                <strong>🎯 To:</strong>
                                <p className="text-gray-700">{itinerary.toCity}</p>
                            </div>
                            <div className="overview-item">
                                <strong>📅 Duration:</strong>
                                <p className="text-gray-700">{itinerary.durationDays} days</p>
                            </div>
                            <div className="overview-item">
                                <strong>💰 Budget:</strong>
                                <p className="text-gray-700 capitalize">{itinerary.budget}</p>
                            </div>
                            <div className="overview-item">
                                <strong>🎭 Travel Style:</strong>
                                <p className="text-gray-700">{itinerary.profileType.join(', ')}</p>
                            </div>
                            {itinerary.extraNotes && (
                                <div className="overview-item">
                                    <strong>📝 Notes:</strong>
                                    <p className="text-gray-700">{itinerary.extraNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Days Timeline */}
                    <div className="space-y-8">
                        {itinerary.detailedPlan.days.map((day, dayIdx) => (
                            <DayTimeline
                                key={day.day_number}
                                day={day}
                                isFirstDay={dayIdx === 0}
                            />
                        ))}
                    </div>

                    <div className="footer mt-12">
                        <p>Generated by AI Travel Planner • {new Date().toLocaleDateString()}</p>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-lg hover:shadow-2xl disabled:opacity-50 transition shadow-lg"
                    >
                        {downloading ? '📥 Generating PDF...' : '📥 Download as PDF'}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition shadow-lg"
                    >
                        🖨️ Print Itinerary
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleMakeAnother}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition shadow-lg"
                    >
                        ✈️ Make Another Itinerary
                    </motion.button>
                </motion.div>
            </div>
        </main>
    );
}
