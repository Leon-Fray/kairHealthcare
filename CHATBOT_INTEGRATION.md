# Chatbot Integration - Complete ✅

The chatbot from `newKari` has been successfully integrated into `kariHealth`. This is a rule-based system that matches patient symptoms to healthcare practitioners using keyword detection and weighted scoring.

## Files Created/Updated

### 1. TypeScript Types
- **File**: `types/dialogue-map.ts`
- **Purpose**: Type definitions for the dialogue map structure

### 2. Dialogue Map Data
- **File**: `data/dialogue-map.json`
- **Purpose**: Contains all doctors, symptoms, keywords, and follow-up questions
- **Note**: This file can be customized to add your own practitioners and symptoms

### 3. API Route
- **File**: `app/api/chat/route.ts`
- **Purpose**: Handles chat requests, detects symptoms, calculates doctor scores, and maps to real practitioners
- **Features**:
  - Accepts messages array format
  - Detects symptoms from user input
  - Calculates weighted scores for practitioners
  - Maps dialogue-map doctors to real practitioners from database
  - Falls back to search page if no exact match found

### 4. Health Assistant Component
- **File**: `components/chatbot/health-assistant.tsx`
- **Purpose**: Chat interface with floating button and chat window
- **Features**:
  - Floating chat button (bottom-right)
  - Expandable chat window
  - Real-time message display
  - Practitioner recommendations with booking buttons
  - Handles both real practitioner IDs and dialogue-map IDs

### 5. Chatbot Wrapper
- **File**: `components/chatbot/chatbot-wrapper.tsx`
- **Purpose**: Controls visibility based on user role (only shows for patients)
- **Integration**: Already included in `components/layout/main-layout.tsx`

## How It Works

1. **User describes symptoms**: "I have a headache and feel dizzy"
2. **Keyword detection**: System searches for keywords in `dialogue-map.json`
3. **Score calculation**: Each doctor gets a score based on symptom weights
4. **Practitioner mapping**: System searches database for practitioners with matching specialty
5. **Recommendation**: Top practitioner is recommended with booking button
6. **Fallback**: If no exact match, redirects to search page with specialty filter

## Booking Flow

- **Real Practitioner ID**: Directly navigates to `/booking/{practitionerId}`
- **Dialogue-Map ID** (starts with `dr_`): Redirects to `/search?specialty={specialty}`

## Customization

### Adding a Doctor to Dialogue Map

Edit `data/dialogue-map.json`:

```json
{
  "id": "dr_unique_id",
  "name": "Dr. Your Name",
  "specialty": "Your Specialty",
  "description": "What you treat",
  "weights": {
    "symptom_key": 0.9,
    "another_symptom": 0.7
  }
}
```

**Important**: The `specialty` field must match exactly with the specialty names in your database for automatic practitioner matching to work.

### Adding a Symptom

```json
"symptom_key": {
  "keywords": ["way patients say it", "another way"],
  "follow_up": "What question should we ask?",
  "aliases": ["alternative terms"]
}
```

### Weight Guidelines

| Weight | Meaning | Example |
|--------|---------|---------|
| 0.95-1.0 | Main specialty | Neurologist → migraine (0.98) |
| 0.8-0.94 | Common in practice | Neurologist → dizziness (0.8) |
| 0.6-0.79 | Can treat | Neurologist → fatigue (0.6) |
| 0.5-0.59 | General knowledge | GP → most things (0.5-0.6) |

## Specialty Matching

The system matches dialogue-map doctors to real practitioners by specialty name. The matching is **case-sensitive and exact**, so ensure specialty names match exactly between:

- `dialogue-map.json` → `specialty` field
- Database → `practitioners.specialty` column

If no exact match is found, the system will:
1. Show the dialogue-map doctor recommendation
2. Redirect to search page with specialty filter when booking

## Testing

1. Sign in as a patient
2. Look for the floating chat button (bottom-right)
3. Click to open the chat
4. Type symptoms like:
   - "I have a headache"
   - "My stomach hurts"
   - "I feel dizzy"
5. Verify practitioner recommendations appear
6. Click "Book Appointment Now" to test booking flow

## Current Specialties in Dialogue Map

- General Practitioner
- Orthopedist
- Neurologist
- Gastroenterologist
- Ear, Nose, and Throat (ENT) Specialist

## Notes

- The chatbot only appears for users with `role: 'patient'`
- No AI API required - it's a rule-based system
- All logic is in the API route and dialogue map
- The system is fully functional and ready to use

