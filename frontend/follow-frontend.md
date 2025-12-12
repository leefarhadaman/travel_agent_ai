<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Travel AI Agent Frontend Workflow (Next.js)

Complete multi-step form with plan selection, detailed itinerary display, and image gallery. Uses App Router, TypeScript, Tailwind CSS.

## Project Setup

```bash
pnpm create next-app@latest travel-ai-frontend --typescript --tailwind --app
cd travel-ai-frontend
pnpm add axios zustand react-hook-form zod @hookform/resolvers framer-motion next-image-export-optimizer
```


## Folder Structure

```
travel-ai-frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (home)
│   ├── itinerary/
│   │   └── page.tsx (multi-step form)
│   ├── plans/
│   │   └── [id]/
│   │       └── page.tsx (3 plan cards)
│   └── details/
│       └── [id]/
│           └── page.tsx (full itinerary)
├── components/
│   ├── Stepper.tsx
│   ├── PlanCard.tsx
│   ├── DayTimeline.tsx
│   ├── ImageGallery.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── api.ts (axios instance)
│   ├── types.ts (TypeScript interfaces)
│   └── store.ts (Zustand state)
├── styles/
│   └── globals.css
└── .env.local
```


## .env.local

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```


## Types (lib/types.ts)

```typescript
export interface Activity {
  name: string;
  description: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  approx_duration_hours: number;
  travel_info: string;
  image_url: string;
}

export interface DayBlock {
  day_number: number;
  day_title: string;
  morning: {
    label: string;
    time_range: string;
    activities: Activity[];
  };
  afternoon: {
    label: string;
    time_range: string;
    activities: Activity[];
  };
  evening: {
    label: string;
    time_range: string;
    activities: Activity[];
  };
}

export interface Plan {
  id: string;
  title: string;
  summary: string;
  estimated_total_cost: {
    currency: string;
    amount_min: number;
    amount_max: number;
  };
  suitability_tags: string[];
  days: DayBlock[];
}

export interface PlanResponse {
  plans: Plan[];
}

export interface DetailedStep {
  time: string;
  name: string;
  description: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  transport_from_previous: {
    mode: string;
    approx_minutes: number;
    notes: string;
  };
  approx_duration_minutes: number;
  cost_hint: {
    currency: string;
    amount_min: number;
    amount_max: number;
  };
  image_url: string;
}

export interface DetailedSegment {
  segment_type: "morning" | "afternoon" | "evening" | "night";
  time_range: string;
  label: string;
  steps: DetailedStep[];
}

export interface DetailedDay {
  day_number: number;
  date_hint: string;
  segments: DetailedSegment[];
}

export interface DetailedPlan {
  plan_id: string;
  title: string;
  days: DetailedDay[];
}

export interface Itinerary {
  _id: string;
  userId: string;
  fromCity: string;
  toCity: string;
  durationDays: number;
  profileType: string[];
  budget: string;
  plans: Plan[];
  detailedPlan?: DetailedPlan;
  createdAt: string;
}
```


## API Client (lib/api.ts)

```typescript
import axios from 'axios';
import { PlanResponse, DetailedPlan } from './types';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const generatePlans = async (payload: {
  userId: string;
  fromCity: string;
  toCity: string;
  duration: number;
  profileType: string[];
  budget: string;
  extraNotes?: string;
}) => {
  const response = await API.post<{ itineraryId: string; plans: PlanResponse['plans'] }>(
    '/api/generate-plans',
    payload
  );
  return response.data;
};

export const selectPlan = async (itineraryId: string, planIndex: number) => {
  const response = await API.post<{ detailedPlan: DetailedPlan }>(
    `/api/select-plan/${itineraryId}`,
    { planIndex }
  );
  return response.data;
};

export const getItinerary = async (itineraryId: string) => {
  const response = await API.get(`/api/itinerary/${itineraryId}`);
  return response.data;
};
```


## Zustand Store (lib/store.ts)

```typescript
import { create } from 'zustand';
import { Itinerary, Plan } from './types';

interface TravelStore {
  itinerary: Itinerary | null;
  setItinerary: (itinerary: Itinerary) => void;
  selectedPlanIndex: number | null;
  setSelectedPlanIndex: (index: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  itinerary: null,
  setItinerary: (itinerary) => set({ itinerary }),
  selectedPlanIndex: null,
  setSelectedPlanIndex: (index) => set({ selectedPlanIndex: index }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error })
}));
```


## Components

### Stepper (components/Stepper.tsx)

```typescript
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
```


### PlanCard (components/PlanCard.tsx)

```typescript
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
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      onClick={onSelect}
      className={`
        p-6 rounded-lg cursor-pointer border-2 transition-all
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
        <span className="text-xl font-bold text-green-600">
          ${plan.estimated_total_cost.amount_min}–${plan.estimated_total_cost.amount_max}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{plan.summary}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {plan.suitability_tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {plan.days.slice(0, 3).map((day) => (
          <img
            key={day.day_number}
            src={day.morning.activities[^0]?.image_url || '/placeholder.jpg'}
            alt={day.day_title}
            className="w-full h-24 object-cover rounded-md"
          />
        ))}
      </div>

      {isSelected && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600"
        >
          View Full Itinerary →
        </motion.button>
      )}
    </motion.div>
  );
}
```


### DayTimeline (components/DayTimeline.tsx)

```typescript
'use client';

import { DetailedDay } from '@/lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayTimelineProps {
  day: DetailedDay;
}

export default function DayTimeline({ day }: DayTimelineProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="border-l-4 border-blue-500 pl-6 py-4 mb-6"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between items-center w-full mb-4 hover:opacity-80"
      >
        <h3 className="text-2xl font-bold text-gray-900">{day.date_hint}</h3>
        <span className="text-2xl">{expanded ? '−' : '+'}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {day.segments.map((segment, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="font-bold text-lg text-blue-600 capitalize mb-3">
                  {segment.segment_type} ({segment.time_range})
                </h4>

                <div className="space-y-4">
                  {segment.steps.map((step, stepIdx) => (
                    <motion.div
                      key={stepIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stepIdx * 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex gap-4">
                        <img
                          src={step.image_url}
                          alt={step.name}
                          className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                        />

                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{step.time} – {step.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            📍 {step.location.name} • ⏱ {step.approx_duration_minutes} min
                          </p>
                          {step.transport_from_previous.approx_minutes > 0 && (
                            <p className="text-xs text-blue-600 mt-1">
                              🚗 {step.transport_from_previous.mode} ({step.transport_from_previous.approx_minutes} min)
                            </p>
                          )}
                          <p className="text-sm font-bold text-green-600 mt-2">
                            ${step.cost_hint.amount_min}–${step.cost_hint.amount_max}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```


### LoadingSpinner (components/LoadingSpinner.tsx)

```typescript
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
```


## Pages

### Home (app/page.tsx)

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-gray-900 mb-4">✈️ AI Travel Planner</h1>
        <p className="text-xl text-gray-600 mb-8">Personalized itineraries powered by Gemini AI</p>
        <Link href="/itinerary">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700"
          >
            Plan Your Trip →
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}
```


### Itinerary Form (app/itinerary/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTravelStore } from '@/lib/store';
import { generatePlans } from '@/lib/api';
import { motion } from 'framer-motion';

export default function ItineraryPage() {
  const router = useRouter();
  const { setItinerary, setLoading, loading } = useTravelStore();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    duration: 3,
    profileType: [] as string[],
    budget: 'medium',
    extraNotes: ''
  });

  const profiles = ['adventure', 'religious', 'exploring', 'foodie', 'family', 'romantic', 'budget'];

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
        ...formData,
        duration: formData.duration
      });

      setItinerary({
        _id: result.itineraryId,
        userId: 'user-' + Date.now(),
        plans: result.plans,
        ...formData,
        durationDays: formData.duration,
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Stepper currentStep={step} totalSteps={3} />

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 shadow-lg"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Where are you going?</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    placeholder="e.g., New York"
                    value={formData.fromCity}
                    onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">To</label>
                  <input
                    type="text"
                    placeholder="e.g., Tokyo"
                    value={formData.toCity}
                    onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Duration: {formData.duration} days
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">What kind of traveler are you?</h2>

              <div className="grid grid-cols-2 gap-3">
                {profiles.map((profile) => (
                  <motion.button
                    key={profile}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleProfileToggle(profile)}
                    className={`
                      px-4 py-3 rounded-lg font-bold transition-all
                      ${
                        formData.profileType.includes(profile)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget Level</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Budget</option>
                  <option value="medium">Medium</option>
                  <option value="high">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes (optional)</label>
                <textarea
                  value={formData.extraNotes}
                  onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                  placeholder="Any preferences? (e.g., vegetarian diet, must see X, avoid Y)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold disabled:opacity-50"
            >
              ← Back
            </motion.button>

            {step < 3 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
              >
                Next →
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
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
```


### Plans Selection (app/plans/[id]/page.tsx)

```typescript
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
  const { itinerary, setLoading, loading, selectedPlanIndex, setSelectedPlanIndex } = useTravelStore();
  const [submitting, setSubmitting] = useState(false);

  if (!itinerary) return <LoadingSpinner />;

  const handleSelectPlan = async () => {
    if (selectedPlanIndex === null) {
      alert('Please select a plan');
      return;
    }

    setSubmitting(true);
    try {
      const result = await selectPlan(itinerary._id, selectedPlanIndex);
      router.push(`/details/${itinerary._id}`);
    } catch (error) {
      alert('Error selecting plan');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-2"
        >
          {itinerary.fromCity} → {itinerary.toCity}
        </motion.h1>
        <p className="text-gray-600 mb-8">{itinerary.durationDays} days • {itinerary.profileType.join(', ')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {itinerary.plans.map((plan, idx) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanIndex === idx}
              onSelect={() => setSelectedPlanIndex(idx)}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSelectPlan}
          disabled={selectedPlanIndex === null || submitting}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Continue with Selected Plan →'}
        </motion.button>
      </div>
    </main>
  );
}
```


### Full Itinerary (app/details/[id]/page.tsx)

```typescript
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import DayTimeline from '@/components/DayTimeline';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTravelStore } from '@/lib/store';
import { getItinerary } from '@/lib/api';
import { motion } from 'framer-motion';

export default function DetailsPage() {
  const params = useParams();
  const { itinerary, setItinerary, loading, setLoading } = useTravelStore();

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

    if (!itinerary) fetchItinerary();
  }, [params.id]);

  if (loading || !itinerary?.detailedPlan) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{itinerary.detailedPlan.title}</h1>
          <p className="text-gray-600 mt-2">
            {itinerary.durationDays} days in {itinerary.toCity}
          </p>
        </motion.div>

        <div className="space-y-6">
          {itinerary.detailedPlan.days.map((day) => (
            <DayTimeline key={day.day_number} day={day} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            📄 Print Itinerary
          </button>
        </motion.div>
      </div>
    </main>
  );
}
```


## Start Frontend

```bash
pnpm dev
# Open http://localhost:3000
```

**Flow**: Home → Itinerary Form (3 steps) → Select Plan → Full Details with Day Timeline. Ready for your backend endpoints.[^1][^2]

<div align="center">⁂</div>

[^1]: https://www.youtube.com/watch?v=mzL7lt0WpHw

[^2]: https://www.youtube.com/watch?v=sXRDL-EPtrM

