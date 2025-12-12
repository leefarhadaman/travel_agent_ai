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
    durationDays: number;
    profileType: string[];
    budget: string;
    extraNotes?: string;
}) => {
    const response = await API.post<{ itineraryId: string; plans: PlanResponse['plans'] }>(
        '/api/itinerary/generate-plans',
        payload
    );
    return response.data;
};

export const selectPlan = async (itineraryId: string, planId: string) => {
    const response = await API.post<{ itineraryId: string; detailedPlan: DetailedPlan }>(
        '/api/itinerary/expand-plan',
        { itineraryId, planId }
    );
    return response.data;
};

export const getItinerary = async (itineraryId: string) => {
    const response = await API.get(`/api/itinerary/${itineraryId}`);
    return response.data;
};
