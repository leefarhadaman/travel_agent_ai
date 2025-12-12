// Popular cities worldwide with country info
export const POPULAR_CITIES = [
    // ===== USA =====
    { label: 'New York, USA', value: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
    { label: 'Los Angeles, USA', value: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
    { label: 'Chicago, USA', value: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298 },
    { label: 'San Francisco, USA', value: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
    { label: 'Miami, USA', value: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918 },
    { label: 'Seattle, USA', value: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321 },
    { label: 'Boston, USA', value: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589 },
    { label: 'Las Vegas, USA', value: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398 },

    // ===== Canada =====
    { label: 'Toronto, Canada', value: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    { label: 'Vancouver, Canada', value: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
    { label: 'Montreal, Canada', value: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673 },

    // ===== Europe =====
    { label: 'London, UK', value: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    { label: 'Manchester, UK', value: 'Manchester', country: 'UK', lat: 53.4808, lng: -2.2426 },
    { label: 'Paris, France', value: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { label: 'Lyon, France', value: 'Lyon', country: 'France', lat: 45.764, lng: 4.8357 },
    { label: 'Berlin, Germany', value: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405 },
    { label: 'Munich, Germany', value: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.582 },
    { label: 'Madrid, Spain', value: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
    { label: 'Barcelona, Spain', value: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
    { label: 'Rome, Italy', value: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
    { label: 'Milan, Italy', value: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.19 },
    { label: 'Amsterdam, Netherlands', value: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
    { label: 'Vienna, Austria', value: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
    { label: 'Zurich, Switzerland', value: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
    { label: 'Stockholm, Sweden', value: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686 },

    // ===== Middle East =====
    { label: 'Dubai, UAE', value: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    { label: 'Abu Dhabi, UAE', value: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lng: 54.3773 },
    { label: 'Doha, Qatar', value: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531 },
    { label: 'Riyadh, Saudi Arabia', value: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
    { label: 'Jeddah, Saudi Arabia', value: 'Jeddah', country: 'Saudi Arabia', lat: 21.4858, lng: 39.1925 },

    // ===== Asia =====
    { label: 'Tokyo, Japan', value: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { label: 'Osaka, Japan', value: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023 },
    { label: 'Seoul, South Korea', value: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978 },
    { label: 'Busan, South Korea', value: 'Busan', country: 'South Korea', lat: 35.1796, lng: 129.0756 },
    { label: 'Hong Kong, China', value: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694 },
    { label: 'Shanghai, China', value: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
    { label: 'Beijing, China', value: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
    { label: 'Bangkok, Thailand', value: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
    { label: 'Phuket, Thailand', value: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 },
    { label: 'Singapore, Singapore', value: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { label: 'Kuala Lumpur, Malaysia', value: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869 },
    { label: 'Jakarta, Indonesia', value: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
    { label: 'Manila, Philippines', value: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842 },

    // ===== Africa =====
    { label: 'Cairo, Egypt', value: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
    { label: 'Cape Town, South Africa', value: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
    { label: 'Nairobi, Kenya', value: 'Nairobi', country: 'Kenya', lat: -1.2864, lng: 36.8172 },
    { label: 'Lagos, Nigeria', value: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },

    // ==================================================================
    //                          INDIA (Huge Expanded List)
    // ==================================================================

    // Tier 1 Cities
    { label: 'Mumbai, India', value: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777 },
    { label: 'Delhi, India', value: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025 },
    { label: 'Bengaluru, India', value: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946 },
    { label: 'Hyderabad, India', value: 'Hyderabad', country: 'India', lat: 17.385, lng: 78.4867 },
    { label: 'Chennai, India', value: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
    { label: 'Kolkata, India', value: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
    { label: 'Pune, India', value: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
    { label: 'Ahmedabad, India', value: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714 },

    // Tier 2 & Tier 3 Cities
    { label: 'Surat, India', value: 'Surat', country: 'India', lat: 21.1702, lng: 72.8311 },
    { label: 'Jaipur, India', value: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
    { label: 'Lucknow, India', value: 'Lucknow', country: 'India', lat: 26.8467, lng: 80.9462 },
    { label: 'Kanpur, India', value: 'Kanpur', country: 'India', lat: 26.4499, lng: 80.3319 },
    { label: 'Nagpur, India', value: 'Nagpur', country: 'India', lat: 21.1458, lng: 79.0882 },
    { label: 'Indore, India', value: 'Indore', country: 'India', lat: 22.7196, lng: 75.8577 },
    { label: 'Bhopal, India', value: 'Bhopal', country: 'India', lat: 23.2599, lng: 77.4126 },
    { label: 'Patna, India', value: 'Patna', country: 'India', lat: 25.5941, lng: 85.1376 },
    { label: 'Bhubaneswar, India', value: 'Bhubaneswar', country: 'India', lat: 20.2961, lng: 85.8245 },
    { label: 'Agra, India', value: 'Agra', country: 'India', lat: 27.1767, lng: 78.0081 },
    { label: 'Varanasi, India', value: 'Varanasi', country: 'India', lat: 25.3176, lng: 82.9739 },
    { label: 'Visakhapatnam, India', value: 'Visakhapatnam', country: 'India', lat: 17.6868, lng: 83.2185 },
    { label: 'Vijayawada, India', value: 'Vijayawada', country: 'India', lat: 16.5062, lng: 80.648 },
    { label: 'Coimbatore, India', value: 'Coimbatore', country: 'India', lat: 11.0168, lng: 76.9558 },
    { label: 'Kochi, India', value: 'Kochi', country: 'India', lat: 9.9312, lng: 76.2673 },
    { label: 'Thiruvananthapuram, India', value: 'Thiruvananthapuram', country: 'India', lat: 8.5241, lng: 76.9366 },
    { label: 'Madurai, India', value: 'Madurai', country: 'India', lat: 9.9252, lng: 78.1198 },
    { label: 'Mysuru, India', value: 'Mysuru', country: 'India', lat: 12.2958, lng: 76.6394 },
    { label: 'Guwahati, India', value: 'Guwahati', country: 'India', lat: 26.1445, lng: 91.7362 },
    { label: 'Shillong, India', value: 'Shillong', country: 'India', lat: 25.5788, lng: 91.8933 },
    { label: 'Ranchi, India', value: 'Ranchi', country: 'India', lat: 23.3441, lng: 85.3096 },
    { label: 'Jamshedpur, India', value: 'Jamshedpur', country: 'India', lat: 22.8046, lng: 86.2029 },
    { label: 'Raipur, India', value: 'Raipur', country: 'India', lat: 21.2514, lng: 81.6296 },
    { label: 'Bilaspur, India', value: 'Bilaspur', country: 'India', lat: 22.0797, lng: 82.1409 },
    { label: 'Dehradun, India', value: 'Dehradun', country: 'India', lat: 30.3165, lng: 78.0322 },
    { label: 'Haridwar, India', value: 'Haridwar', country: 'India', lat: 29.9457, lng: 78.1642 },
    { label: 'Shimla, India', value: 'Shimla', country: 'India', lat: 31.1048, lng: 77.1734 },
    { label: 'Chandigarh, India', value: 'Chandigarh', country: 'India', lat: 30.7333, lng: 76.7794 },
    { label: 'Ludhiana, India', value: 'Ludhiana', country: 'India', lat: 30.901, lng: 75.8573 },
    { label: 'Amritsar, India', value: 'Amritsar', country: 'India', lat: 31.634, lng: 74.8723 },
    { label: 'Jodhpur, India', value: 'Jodhpur', country: 'India', lat: 26.2389, lng: 73.0243 },
    { label: 'Udaipur, India', value: 'Udaipur', country: 'India', lat: 24.5854, lng: 73.7125 },
    { label: 'Nashik, India', value: 'Nashik', country: 'India', lat: 19.9975, lng: 73.7898 },
    { label: 'Aurangabad, India', value: 'Aurangabad', country: 'India', lat: 19.8762, lng: 75.3433 },
    { label: 'Kolhapur, India', value: 'Kolhapur', country: 'India', lat: 16.7049, lng: 74.2433 },
    { label: 'Goa, India', value: 'Goa', country: 'India', lat: 15.2993, lng: 74.124 },
];


export const searchCities = (input: string) => {
    if (!input) return POPULAR_CITIES;

    const lowerInput = input.toLowerCase();
    return POPULAR_CITIES.filter(city =>
        city.label.toLowerCase().includes(lowerInput) ||
        city.value.toLowerCase().includes(lowerInput) ||
        city.country.toLowerCase().includes(lowerInput)
    );
};
