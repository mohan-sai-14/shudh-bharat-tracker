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
      pollution_reports: {
        Row: {
          id: string
          created_at: string
          latitude: number
          longitude: number
          type: 'air' | 'water' | 'noise' | 'other'
          description: string
          severity: 'low' | 'medium' | 'high'
          status: 'pending' | 'investigating' | 'resolved'
          images: string[]
          user_id: string | null
          city: string
          address: string
          upvotes: number
        }
        Insert: {
          id?: string
          created_at?: string
          latitude: number
          longitude: number
          type: 'air' | 'water' | 'noise' | 'other'
          description: string
          severity: 'low' | 'medium' | 'high'
          status?: 'pending' | 'investigating' | 'resolved'
          images?: string[]
          user_id?: string | null
          city: string
          address: string
          upvotes?: number
        }
        Update: {
          id?: string
          created_at?: string
          latitude?: number
          longitude?: number
          type?: 'air' | 'water' | 'noise' | 'other'
          description?: string
          severity?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'investigating' | 'resolved'
          images?: string[]
          user_id?: string | null
          city?: string
          address?: string
          upvotes?: number
        }
      }
      community_posts: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          user_id: string | null
          likes: number
          comments_count: number
          tags: string[]
          images: string[]
          city: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          user_id?: string | null
          likes?: number
          comments_count?: number
          tags?: string[]
          images?: string[]
          city: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          user_id?: string | null
          likes?: number
          comments_count?: number
          tags?: string[]
          images?: string[]
          city?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          created_at: string
          post_id: string
          user_id: string | null
          content: string
          likes: number
        }
        Insert: {
          id?: string
          created_at?: string
          post_id: string
          user_id?: string | null
          content: string
          likes?: number
        }
        Update: {
          id?: string
          created_at?: string
          post_id?: string
          user_id?: string | null
          content?: string
          likes?: number
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
