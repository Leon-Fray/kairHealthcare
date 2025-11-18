export interface DoctorWeights {
  [symptomKey: string]: number
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  description: string
  weights: DoctorWeights
}

export interface Symptom {
  keywords: string[]
  follow_up: string
  aliases: string[]
}

export interface DialogueMap {
  doctors: Doctor[]
  symptoms: {
    [symptomKey: string]: Symptom
  }
  follow_up_questions: {
    general: string[]
    severity?: string[]
  }
}
