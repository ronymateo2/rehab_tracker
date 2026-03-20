export type Lesion = {
  id: string
  user_id: string
  name: string
  zone: string | null
  color: string
  is_active: boolean
  created_at: string
}

export type Session = {
  id: string
  user_id: string
  lesion_id: string
  date: string          // formato ISO: 'YYYY-MM-DD'
  pain_level: number    // 1–10
  exercises: string | null
  notes: string | null
  created_at: string
  session_photos?: SessionPhoto[]
}

export type SessionPhoto = {
  id: string
  session_id: string
  user_id: string
  storage_path: string
  created_at: string
  url?: string          // Signed URL
}

export type SessionFormData = {
  lesion_id: string
  date: string
  pain_level: number
  exercises: string
  notes: string
  photos: File[]
}
