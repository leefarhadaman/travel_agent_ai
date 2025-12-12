import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fromCity: String,
  toCity: String,
  durationDays: Number,
  profileType: [String],
  budget: String,
  extraNotes: String,
  plans: { type: Array, default: [] },
  detailedPlan: { type: Object, default: null },
  selectedPlanId: String
}, { timestamps: true });

export default mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);
