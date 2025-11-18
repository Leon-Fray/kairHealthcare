import { NextRequest, NextResponse } from 'next/server'
import dialogueMapData from '@/data/dialogue-map.json'
import type { DialogueMap } from '@/types/dialogue-map'
import { searchPractitioners } from '@/lib/database'

const dialogueMap = dialogueMapData as unknown as DialogueMap

interface DetectedSymptom {
  symptomKey: string
  symptomData: {
    keywords: string[]
    follow_up: string
    aliases: string[]
  }
  confidence: number
}

interface DoctorScore {
  doctor: {
    id: string
    name: string
    specialty: string
    description: string
    weights: Record<string, number>
  }
  score: number
  matchedSymptoms: string[]
}

// Check if a keyword is negated in the text
function isNegated(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const keywordIndex = lowerText.indexOf(lowerKeyword)
  
  if (keywordIndex === -1) return false
  
  // Negation words/phrases that indicate the symptom is NOT present
  const negationPatterns = [
    /\bno\s+/i,
    /\bnot\s+/i,
    /\bwithout\s+/i,
    /\bdon'?t\s+have/i,
    /\bdoesn'?t\s+have/i,
    /\bhaven'?t\s+had/i,
    /\bhasn'?t\s+had/i,
    /\bdon'?t\s+feel/i,
    /\bdoesn'?t\s+feel/i,
    /\bno\s+signs?\s+of/i,
    /\bno\s+indication\s+of/i,
    /\bexclud/i, // exclude, excluding, excluded
    /\babsent/i,
    /\bdenies?\s+/i, // denies, deny
  ]
  
  // Check a window of text around the keyword (50 characters before and after)
  const start = Math.max(0, keywordIndex - 50)
  const end = Math.min(lowerText.length, keywordIndex + lowerKeyword.length + 50)
  const context = lowerText.substring(start, end)
  
  // Check if any negation pattern appears before the keyword in the context
  const keywordPositionInContext = keywordIndex - start
  const beforeKeyword = context.substring(0, keywordPositionInContext)
  
  for (const pattern of negationPatterns) {
    if (pattern.test(beforeKeyword)) {
      return true
    }
  }
  
  // Also check for "no [keyword]" pattern directly
  const directNegationPattern = new RegExp(`\\bno\\s+${lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  if (directNegationPattern.test(lowerText)) {
    return true
  }
  
  // Check for "[keyword] not" or "[keyword] no" patterns
  const afterKeyword = context.substring(keywordPositionInContext + lowerKeyword.length)
  if (/\b(not|no)\b/i.test(afterKeyword.substring(0, 20))) {
    return true
  }
  
  return false
}

// Detect symptoms from user input using keyword matching
function detectSymptoms(text: string): DetectedSymptom[] {
  const lowerText = text.toLowerCase()
  const detected: DetectedSymptom[] = []

  for (const [symptomKey, symptomData] of Object.entries(dialogueMap.symptoms)) {
    const keywords = symptomData.keywords || []
    const aliases = symptomData.aliases || []
    const allKeywords = [...keywords, ...aliases]

    for (const keyword of allKeywords) {
      const lowerKeyword = keyword.toLowerCase()
      if (lowerText.includes(lowerKeyword)) {
        // Check if this symptom is negated
        if (isNegated(text, keyword)) {
          continue // Skip this symptom - it's negated
        }
        
        // Calculate confidence based on keyword length and position
        const confidence = keyword.length > 5 ? 1.0 : 0.8
        detected.push({
          symptomKey,
          symptomData,
          confidence,
        })
        break // Only count each symptom once
      }
    }
  }

  return detected
}

// Calculate doctor scores based on detected symptoms
function calculateDoctorScores(symptoms: DetectedSymptom[]): DoctorScore[] {
  const doctorScores: DoctorScore[] = []

  for (const doctor of dialogueMap.doctors) {
    let score = 0
    const matchedSymptoms: string[] = []

    for (const { symptomKey, confidence } of symptoms) {
      const weight = doctor.weights[symptomKey as keyof typeof doctor.weights]
      if (weight) {
        score += weight * confidence
        matchedSymptoms.push(symptomKey)
      }
    }

    if (score > 0 || matchedSymptoms.length > 0) {
      doctorScores.push({ doctor, score, matchedSymptoms })
    }
  }

  // Sort by score descending
  return doctorScores.sort((a, b) => b.score - a.score)
}

// Get conversation context
function getConversationContext(messages: any[]) {
  const userMessages = messages.filter((m: any) => m.role === 'user')
  const allUserText = userMessages.map((m: any) => m.content).join(' ')
  
  return {
    userMessages,
    allUserText,
    messageCount: userMessages.length,
  }
}

// Generate response based on conversation state
async function generateResponse(messages: any[]) {
  const context = getConversationContext(messages)
  
  // Initial greeting
  if (context.messageCount === 0) {
    return {
      message: "Hello! I'm your health assistant. Please tell me about your symptoms, and I'll help you find the right doctor. What brings you here today?",
    }
  }

  // Detect symptoms from all user messages
  const detectedSymptoms = detectSymptoms(context.allUserText)
  
  // If no symptoms detected yet, ask for clarification
  if (detectedSymptoms.length === 0) {
    if (context.messageCount === 1) {
      return {
        message: "I'd like to help you find the right doctor. Could you describe your symptoms in more detail? For example, are you experiencing any pain, discomfort, or other health concerns?",
      }
    } else {
      return {
        message: "I'm having trouble identifying specific symptoms. Could you tell me more about what you're feeling? For instance, do you have any pain, fever, nausea, or other symptoms?",
      }
    }
  }

  // Get the most recently detected symptom for follow-up questions
  const lastUserMessage = context.userMessages[context.userMessages.length - 1]?.content || ''
  const recentSymptoms = detectSymptoms(lastUserMessage)
  
  // Ask follow-up questions for newly mentioned symptoms (in early conversation)
  if (recentSymptoms.length > 0 && context.messageCount < 3) {
    const symptom = recentSymptoms[0]
    const followUpQuestion = symptom.symptomData.follow_up
    
    if (followUpQuestion) {
      return {
        message: `I understand you're experiencing ${symptom.symptomKey.replace(/_/g, ' ')}. ${followUpQuestion}`,
      }
    }
  }

  // After gathering enough information (2-3 messages), provide doctor recommendations
  if (context.messageCount >= 2) {
    const doctorScores = calculateDoctorScores(detectedSymptoms)
    
    if (doctorScores.length === 0) {
      // Search for general practitioners
      const generalPractitioners = await searchPractitioners({
        specialty: 'General Practitioner',
      })

      if (generalPractitioners.length > 0) {
        const practitioner = generalPractitioners[0]
        return {
          message: "Based on what you've shared, I recommend consulting with a general practitioner who can assess your symptoms and provide appropriate care. Would you like to book an appointment?",
          practitioner: {
            id: practitioner.id,
            name: practitioner.profiles.full_name,
            specialty: practitioner.specialty,
            hospital: 'Available',
          },
        }
      }

      return {
        message: "Based on what you've shared, I recommend consulting with a general practitioner who can assess your symptoms and provide appropriate care. Would you like me to help you find one?",
      }
    }

    // Get top 1-2 doctors
    const topDoctors = doctorScores.slice(0, 2)
    
    // If we have a clear winner (significantly higher score)
    if (topDoctors.length === 1 || topDoctors[0].score > topDoctors[1].score * 1.5) {
      const topDoctor = topDoctors[0].doctor
      
      // Try to find a real practitioner with matching specialty
      const matchingPractitioners = await searchPractitioners({
        specialty: topDoctor.specialty,
      })

      const symptomsText = detectedSymptoms
        .slice(0, 3)
        .map(s => s.symptomKey.replace(/_/g, ' '))
        .join(', ')
      
      if (matchingPractitioners.length > 0) {
        const practitioner = matchingPractitioners[0]
        return {
          message: `Based on your symptoms (${symptomsText}), I recommend **${practitioner.profiles.full_name}**, a ${practitioner.specialty}. ${topDoctor.description}. They would be well-suited to help you with your concerns. Would you like to book an appointment?`,
          practitioner: {
            id: practitioner.id,
            name: practitioner.profiles.full_name,
            specialty: practitioner.specialty,
            hospital: 'Available',
          },
        }
      } else {
        // Fallback to dialogue-map doctor
        return {
          message: `Based on your symptoms (${symptomsText}), I recommend **${topDoctor.name}**, a ${topDoctor.specialty}. ${topDoctor.description}. They would be well-suited to help you with your concerns. Would you like to find a practitioner?`,
          practitioner: {
            id: topDoctor.id,
            name: topDoctor.name,
            specialty: topDoctor.specialty,
            hospital: 'Search for practitioners',
          },
        }
      }
    } else {
      // Return top 2 doctors if they're close in score
      const doctor1 = topDoctors[0].doctor
      const doctor2 = topDoctors[1].doctor
      
      // Try to find real practitioners
      const [practitioners1, practitioners2] = await Promise.all([
        searchPractitioners({ specialty: doctor1.specialty }),
        searchPractitioners({ specialty: doctor2.specialty }),
      ])

      const symptomsText = detectedSymptoms
        .slice(0, 3)
        .map(s => s.symptomKey.replace(/_/g, ' '))
        .join(', ')

      let message = `Based on your symptoms (${symptomsText}), I'd recommend consulting with either:\n\n`

      if (practitioners1.length > 0) {
        message += `1. **${practitioners1[0].profiles.full_name}** - ${practitioners1[0].specialty}\n   ${doctor1.description}\n\n`
      } else {
        message += `1. **${doctor1.name}** - ${doctor1.specialty}\n   ${doctor1.description}\n\n`
      }

      if (practitioners2.length > 0) {
        message += `2. **${practitioners2[0].profiles.full_name}** - ${practitioners2[0].specialty}\n   ${doctor2.description}\n\n`
      } else {
        message += `2. **${doctor2.name}** - ${doctor2.specialty}\n   ${doctor2.description}\n\n`
      }

      message += `Would you like to book with one of them?`

      // Return the first practitioner (real or dialogue-map)
      const primaryPractitioner = practitioners1.length > 0
        ? {
            id: practitioners1[0].id,
            name: practitioners1[0].profiles.full_name,
            specialty: practitioners1[0].specialty,
            hospital: 'Available',
          }
        : {
            id: doctor1.id,
            name: doctor1.name,
            specialty: doctor1.specialty,
            hospital: 'Search for practitioners',
          }

      return {
        message,
        practitioner: primaryPractitioner,
      }
    }
  }

  // Ask general follow-up questions
  const generalQuestions = dialogueMap.follow_up_questions?.general || []
  if (generalQuestions.length > 0) {
    const randomQuestion = generalQuestions[Math.floor(Math.random() * generalQuestions.length)]
    return {
      message: `I see. ${randomQuestion}`,
    }
  }
  
  return {
    message: "Could you tell me more about your symptoms?",
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Generate response using the dialogue map system
    const response = await generateResponse(messages)
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
