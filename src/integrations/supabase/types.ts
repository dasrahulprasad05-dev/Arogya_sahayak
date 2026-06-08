export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          language: string | null
          theme: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          language?: string | null
          theme?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          language?: string | null
          theme?: string | null
        }
      }
      health_logs: {
        Row: {
          id: string
          user_id: string
          type: string
          value: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          value: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          value?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
