<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# no need, I just need prompt. and use mongodb .

use pnpm

Using MongoDB does not change the prompt itself; only how you store the JSON. The key is: force Gemini to return strict JSON (no markdown, no extra text) that your Node/Express backend can `JSON.parse` and insert into MongoDB collections.[^1][^2]

Below are two prompts you can drop directly into your Node code (with `response_mime_type: "application/json"` config).

***

## Prompt 1 – Generate 3 Itinerary Options (Plans A/B/C)

Use this when user fills basic details and preferences.

**System / instruction message:**

> You are a travel planning assistant that always returns valid, minified JSON only.
> Do not include any explanatory text, markdown, comments, or trailing commas.
> Follow the requested schema exactly.

**User prompt (template):**

> Generate 3 different travel itinerary options for the following user.
>
> Input data:
> - From city: `{FROM_CITY}`
> - Destination city: `{TO_CITY}`
> - Trip duration (days): `{DURATION_DAYS}`
> - Traveler profile: `{PROFILE}` (one or more of: "adventure", "religious", "exploring", "foodie", "family", "romantic", "budget")
> - Approximate budget level: `{BUDGET}` (one of: "low", "medium", "high")
> - Extra notes: `{EXTRA_NOTES}` (user free‑text, can be empty)
>
> Constraints:
> - Assume the trip is in the near future, normal weather, and no major travel restrictions.
> - Mix famous sights with some lesser‑known spots that match the traveler profile.
> - Keep daily schedule realistic: max 3–5 main activities per day including meals and travel between spots.
> - Use clear, helpful activity descriptions that a normal traveler can follow.
> - All times are local time at the destination.
> - For each activity block, include a direct HTTPS image URL (e.g. Unsplash or similar) that visually represents that place or activity.
>
> Output format:
> Return **only** raw JSON (UTF‑8, no markdown) with this exact structure:
> ```json > { >   "plans": [ >     { >       "id": "A", >       "title": "Plan A - Short descriptive name", >       "summary": "2–3 sentence human summary of this plan’s vibe and focus.", >       "estimated_total_cost": { >         "currency": "USD", >         "amount_min": 500, >         "amount_max": 900 >       }, >       "suitability_tags": ["adventure", "foodie"], >       "days": [ >         { >           "day_number": 1, >           "day_title": "Short title, e.g. Old Town & Local Food", >           "morning": { >             "label": "Morning", >             "time_range": "08:00–12:00", >             "activities": [ >               { >                 "name": "Activity name", >                 "description": "What to do, where, why it’s interesting (2–3 sentences).", >                 "location": { >                   "name": "Place name", >                   "address": "Street, area, city", >                   "latitude": 0.0, >                   "longitude": 0.0 >                 }, >                 "approx_duration_hours": 2.5, >                 "travel_info": "How to reach from previous activity (on foot/metro/taxi, approx minutes).", >                 "image_url": "https://..." >               } >             ] >           }, >           "afternoon": { >             "label": "Afternoon", >             "time_range": "12:00–17:00", >             "activities": [ /* same activity schema as morning */ ] >           }, >           "evening": { >             "label": "Evening", >             "time_range": "17:00–22:00", >             "activities": [ /* same activity schema as morning */ ] >           } >         } >       ] >     } >   ] > } > ```
>
> Rules:
> - Always return exactly 3 objects in `plans` with `"id"` equal to `"A"`, `"B"`, and `"C"`.
> - `days.length` must equal `{DURATION_DAYS}` for each plan.
> - If you cannot fill some optional field (like coordinates), set `latitude` and `longitude` to `0` and still keep valid JSON.
> - Do not add any other root‑level keys.
> - Do not wrap JSON in backticks or markdown.
> - Do not include comments.

You configure Gemini JSON mode via generation config (Node)  and then directly store result in MongoDB, e.g. `plans` array inside a `Trip` document.[^3][^4][^1]

***

## Prompt 2 – Expand Selected Plan into Detailed Day/Time Blocks

After user picks A/B/C, you send the chosen plan back for more detailed breakdown.

**System / instruction message:**

> You are a travel planning assistant that expands a draft itinerary into a very detailed day‑by‑day plan.
> You always return strictly valid JSON without markdown or commentary.

**User prompt (template):**

> Expand the following draft itinerary into a fully detailed schedule.
> The user has selected this plan:
> ```json > {SELECTED_PLAN_JSON} > ```
>
> Requirements:
> - Keep the same number of days as in the input.
> - For each day, break activities into more granular steps, keeping time ranges realistic.
> - Include walking/transport transitions between locations, with approximate minutes.
> - Include suggestions for breakfast, lunch, snacks, and dinner that match the traveler’s preferences and budget.
> - Avoid over‑packing the day; assume normal human pace (not rushing).
> - Keep activity descriptions concise but specific enough to follow.
> - Provide a direct HTTPS image URL for each granular step.
>
> Output format:
> Return **only** JSON (no markdown) with this structure:
> ```json > { >   "plan_id": "A", >   "title": "Same or slightly refined name as the input plan", >   "days": [ >     { >       "day_number": 1, >       "date_hint": "Day 1", >       "segments": [ >         { >           "segment_type": "morning",  >           "time_range": "08:00–10:00", >           "label": "Breakfast & Old Town Walk", >           "steps": [ >             { >               "time": "08:00", >               "name": "Breakfast at XYZ Café", >               "description": "Short description of what to eat and why this place fits the profile.", >               "location": { >                 "name": "XYZ Café", >                 "address": "Street, area, city", >                 "latitude": 0.0, >                 "longitude": 0.0 >               }, >               "transport_from_previous": { >                 "mode": "walk | metro | taxi | bus", >                 "approx_minutes": 0, >                 "notes": "From hotel to café, for example." >               }, >               "approx_duration_minutes": 60, >               "cost_hint": { >                 "currency": "USD", >                 "amount_min": 10, >                 "amount_max": 20 >               }, >               "image_url": "https://..." >             } >           ] >         } >       ] >     } >   ] > } > ```
>
> Rules:
> - Preserve the overall theme and key places from the original `{SELECTED_PLAN_JSON}`.
> - You may add reasonable nearby spots or food places to make the itinerary smoother, but keep it consistent with the traveler profile and budget.
> - Use `"segment_type"` as one of `"morning"`, `"afternoon"`, `"evening"`, `"night"` only.
> - Do not add any other root‑level keys.
> - Do not wrap JSON in code fences or markdown.

This second JSON can be stored in another field in the same Mongo document, e.g. `detailedPlan` (type `Object` in Mongoose), and rendered day/segment/step wise on frontend.[^5][^3]

***

## Minimal MongoDB Model Idea (Mongoose, pnpm project)

Just to align with your storage style (you can adjust):

```js
// models/Itinerary.js
import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fromCity: String,
  toCity: String,
  durationDays: Number,
  profileType: [String],
  budget: String,
  plans: { type: Array, default: [] },        // from Prompt 1
  detailedPlan: { type: Object, default: null } // from Prompt 2
}, { timestamps: true });

export default mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);
```

Install with pnpm:

```bash
pnpm init
pnpm add express mongoose @google/generative-ai dotenv cors
```

Then in your route you just call `model.generateContent(prompt)` with the above prompt template, `JSON.parse(response.text)` and save directly into this schema.[^2][^4]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://ai.google.dev/gemini-api/docs/structured-output

[^2]: https://github.com/google-gemini/cookbook/blob/main/quickstarts/JSON_mode.ipynb

[^3]: https://www.geeksforgeeks.org/node-js/travel-planning-app-api-using-node-express-js/

[^4]: https://ai.google.dev/api/generate-content

[^5]: https://www.youtube.com/watch?v=K1MK8_QMOiM

[^6]: https://firebase.google.com/docs/ai-logic/generate-structured-output

[^7]: https://ai.google.dev/gemini-api/docs/prompting-strategies

[^8]: https://www.datastudios.org/post/gemini-for-generating-json-outputs-from-structured-prompts

[^9]: https://blog.gdeltproject.org/using-gemini-2-5s-structured-outputs-to-enforce-consistent-stable-json-output-for-story-segmentation/

[^10]: https://github.com/google-gemini/deprecated-generative-ai-python/issues/515

[^11]: https://www.youtube.com/watch?v=c8DOxMnigWE

[^12]: https://github.com/dtrannam/Travel-itinerary

[^13]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/samples/generativeaionvertexai-gemini-controlled-generation-response-schema

[^14]: https://developer.chrome.com/docs/ai/structured-output-for-prompt-api

[^15]: https://gist.github.com/tanaikech/45b1a738b9e27236545a3cbcc1479a58

[^16]: https://dev.to/shrsv/how-to-generate-structured-output-json-yaml-in-gemini-ai-2ok0

[^17]: https://github.com/sn0218/the-tour

[^18]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output

[^19]: https://www.linkedin.com/posts/pratik-tikhe-482375288_reactjs-nodejs-mongodb-activity-7340310831785496576-h2LH

[^20]: https://geminibyexample.com/020-structured-output/

