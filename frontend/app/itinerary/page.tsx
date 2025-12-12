'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTravelStore } from '@/lib/store';
import { generatePlans } from '@/lib/api';
import { searchCities, POPULAR_CITIES } from '@/lib/cities';
import { motion } from 'framer-motion';

export default function ItineraryPage() {
    const router = useRouter();
    const { setItinerary, setSelectedPlanId, setLoading, loading } = useTravelStore();
    const [step, setStep] = useState(1);
    const [fromSuggestions, setFromSuggestions] = useState<typeof POPULAR_CITIES>([]);
    const [toSuggestions, setToSuggestions] = useState<typeof POPULAR_CITIES>([]);
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    const [formData, setFormData] = useState({
        fromCity: '',
        toCity: '',
        durationDays: 3,
        profileType: [] as string[],
        budget: 'medium',
        extraNotes: ''
    });

    const profiles = ['adventure', 'religious', 'exploring', 'foodie', 'family', 'romantic', 'budget'];

    const handleFromCityChange = (value: string) => {
        setFormData({ ...formData, fromCity: value });
        if (value.length > 0) {
            setFromSuggestions(searchCities(value));
            setShowFromDropdown(true);
        } else {
            setShowFromDropdown(false);
        }
    };

    const handleToCityChange = (value: string) => {
        setFormData({ ...formData, toCity: value });
        if (value.length > 0) {
            setToSuggestions(searchCities(value));
            setShowToDropdown(true);
        } else {
            setShowToDropdown(false);
        }
    };

    const handleSelectFromCity = (city: string) => {
        setFormData({ ...formData, fromCity: city });
        setShowFromDropdown(false);
    };

    const handleSelectToCity = (city: string) => {
        setFormData({ ...formData, toCity: city });
        setShowToDropdown(false);
    };

    const handleProfileToggle = (profile: string) => {
        setFormData((prev) => ({
            ...prev,
            profileType: prev.profileType.includes(profile)
                ? prev.profileType.filter((p) => p !== profile)
                : [...prev.profileType, profile]
        }));
    };

    const handleSubmit = async () => {
        if (!formData.fromCity || !formData.toCity || formData.profileType.length === 0) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const result = await generatePlans({
                userId: 'user-' + Date.now(),
                ...formData
            });

            setItinerary({
                _id: result.itineraryId,
                userId: 'user-' + Date.now(),
                plans: result.plans,
                ...formData,
                createdAt: new Date().toISOString()
            });

            router.push(`/plans/${result.itineraryId}`);
        } catch (error) {
            alert('Error generating plans. Try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        ✈️ Plan Your Journey
                    </h1>
                    <p className="text-gray-600 text-lg">Create your perfect itinerary with AI</p>
                </motion.div>

                <Stepper currentStep={step} totalSteps={3} />

                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-2xl"
                >
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Where are you going?</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">From</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., New York"
                                        value={formData.fromCity}
                                        onChange={(e) => handleFromCityChange(e.target.value)}
                                        onFocus={() => formData.fromCity && setShowFromDropdown(true)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                    />
                                    {showFromDropdown && fromSuggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-500 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {fromSuggestions.map((city) => (
                                                <button
                                                    key={city.value}
                                                    onClick={() => handleSelectFromCity(city.label)}
                                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0"
                                                >
                                                    <div className="font-semibold text-gray-900">{city.value}</div>
                                                    <div className="text-sm text-gray-500">{city.country}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">To</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Tokyo"
                                        value={formData.toCity}
                                        onChange={(e) => handleToCityChange(e.target.value)}
                                        onFocus={() => formData.toCity && setShowToDropdown(true)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                    />
                                    {showToDropdown && toSuggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-500 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {toSuggestions.map((city) => (
                                                <button
                                                    key={city.value}
                                                    onClick={() => handleSelectToCity(city.label)}
                                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0"
                                                >
                                                    <div className="font-semibold text-gray-900">{city.value}</div>
                                                    <div className="text-sm text-gray-500">{city.country}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4">
                                    Duration: <span className="text-blue-600 text-lg">{formData.durationDays} days</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={formData.durationDays}
                                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>1 day</span>
                                    <span>30 days</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">What kind of traveler are you?</h2>
                            <p className="text-gray-600">Select all that apply</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {profiles.map((profile) => (
                                    <motion.button
                                        key={profile}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleProfileToggle(profile)}
                                        className={`px-4 py-3 rounded-lg font-bold transition-all border-2 ${formData.profileType.includes(profile)
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        {profile.charAt(0).toUpperCase() + profile.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Budget & Preferences</h2>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Budget Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['low', 'medium', 'high'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData({ ...formData, budget: level })}
                                            className={`px-4 py-3 rounded-lg font-bold transition-all border-2 ${formData.budget === level
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-400'
                                                }`}
                                        >
                                            {level === 'low' ? '💰 Budget' : level === 'medium' ? '💵 Medium' : '💎 Luxury'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes (optional)</label>
                                <textarea
                                    value={formData.extraNotes}
                                    onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                                    placeholder="Any preferences? (e.g., vegetarian diet, must see X, avoid Y)"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg h-24 focus:outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                        >
                            ← Back
                        </motion.button>

                        {step < 3 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                Next →
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition"
                            >
                                Generate Plans ✨
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
