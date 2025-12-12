import express from 'express';
import { generateItineraryPlans, expandItineraryPlan } from '../services/geminiService.js';

const router = express.Router();

// In-memory storage
const itineraryStore = new Map();

// Generate 3 itinerary plan options
router.post('/generate-plans', async (req, res) => {
  try {
    const { userId, fromCity, toCity, durationDays, profileType, budget, extraNotes } = req.body;

    if (!userId || !fromCity || !toCity || !durationDays || !profileType || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userInput = {
      fromCity,
      toCity,
      durationDays,
      profileType: Array.isArray(profileType) ? profileType : [profileType],
      budget,
      extraNotes: extraNotes || ''
    };

    const plans = await generateItineraryPlans(userInput);

    // Store in memory
    const itineraryId = 'itinerary-' + Date.now();
    itineraryStore.set(itineraryId, {
      _id: itineraryId,
      userId,
      fromCity,
      toCity,
      durationDays,
      profileType: userInput.profileType,
      budget,
      extraNotes,
      plans: plans.plans,
      detailedPlan: null,
      selectedPlanId: null,
      createdAt: new Date().toISOString()
    });

    res.json({
      itineraryId,
      plans: plans.plans
    });
  } catch (error) {
    console.error('Error generating plans:', error);
    res.status(500).json({ error: error.message });
  }
});

// Expand selected plan into detailed day/time blocks
router.post('/expand-plan', async (req, res) => {
  try {
    const { itineraryId, planId } = req.body;

    if (!itineraryId || !planId) {
      return res.status(400).json({ error: 'Missing itineraryId or planId' });
    }

    const itinerary = itineraryStore.get(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const selectedPlan = itinerary.plans.find(p => p.id === planId);
    if (!selectedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const userInput = {
      fromCity: itinerary.fromCity,
      toCity: itinerary.toCity,
      durationDays: itinerary.durationDays,
      profileType: itinerary.profileType,
      budget: itinerary.budget,
      extraNotes: itinerary.extraNotes
    };

    const detailedPlan = await expandItineraryPlan(selectedPlan, itinerary.durationDays);

    itinerary.detailedPlan = detailedPlan;
    itinerary.selectedPlanId = planId;

    res.json({
      itineraryId,
      detailedPlan
    });
  } catch (error) {
    console.error('Error expanding plan:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get itinerary by ID
router.get('/:itineraryId', (req, res) => {
  try {
    const itinerary = itineraryStore.get(req.params.itineraryId);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
