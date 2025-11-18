'use client'

import { HealthAssistant } from './health-assistant'
import { useAuth } from '@/components/auth/auth-provider'

export function ChatbotWrapper() {
  const { profile } = useAuth()

  // Only show chatbot to patients
  if (!profile || profile.role !== 'patient') {
    return null
  }

  return <HealthAssistant />
}
