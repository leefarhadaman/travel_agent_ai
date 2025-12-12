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
    segment_type: 'morning' | 'afternoon' | 'evening' | 'night';
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
