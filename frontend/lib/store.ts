import { create } from 'zustand';
import { Itinerary } from './types';

interface TravelStore {
    itinerary: Itinerary | null;
    setItinerary: (itinerary: Itinerary | null) => void;
    selectedPlanId: string | null;
    setSelectedPlanId: (id: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
    itinerary: null,
    setItinerary: (itinerary) => set({ itinerary }),
    selectedPlanId: null,
    setSelectedPlanId: (id) => set({ selectedPlanId: id }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error })
}));
