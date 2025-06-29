
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
      chickens: {
        Row: {
          id: string
          name: string
          age: number
          breed: string
          health_status: 'healthy' | 'sick' | 'recovering' | 'deceased'
          coop_id: string
          last_weight_check: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          breed: string
          health_status: 'healthy' | 'sick' | 'recovering' | 'deceased'
          coop_id: string
          last_weight_check: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          breed?: string
          health_status?: 'healthy' | 'sick' | 'recovering' | 'deceased'
          coop_id?: string
          last_weight_check?: number
          created_at?: string
        }
      }
      coops: {
        Row: {
          id: string
          name: string
          capacity: number
          current_occupancy: number
          temperature: number
          humidity: number
          last_cleaned: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          capacity: number
          current_occupancy: number
          temperature: number
          humidity: number
          last_cleaned: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          capacity?: number
          current_occupancy?: number
          temperature?: number
          humidity?: number
          last_cleaned?: string
          created_at?: string
        }
      }
      cages: {
        Row: {
          id: string
          name: string
          capacity: number
          current_occupancy: number
          new_chickens_count: number
          old_chickens_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          capacity: number
          current_occupancy: number
          new_chickens_count: number
          old_chickens_count: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          capacity?: number
          current_occupancy?: number
          new_chickens_count?: number
          old_chickens_count?: number
          created_at?: string
        }
      }
      egg_collection_records: {
        Row: {
          id: string
          date: string
          cage_id: string
          count: number
          is_from_new_chickens: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          cage_id: string
          count: number
          is_from_new_chickens: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          cage_id?: string
          count?: number
          is_from_new_chickens?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      feed_inventory: {
        Row: {
          id: string
          type: string
          current_stock: number
          daily_consumption: number
          reorder_level: number
          cost_per_kg: number
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          current_stock: number
          daily_consumption: number
          reorder_level: number
          cost_per_kg: number
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          current_stock?: number
          daily_consumption?: number
          reorder_level?: number
          cost_per_kg?: number
          created_at?: string
        }
      }
      health_alerts: {
        Row: {
          id: string
          date: string
          chicken_id: string | null
          coop_id: string | null
          alert_type: 'disease' | 'injury' | 'behavior' | 'temperature' | 'water' | 'feed' | 'other'
          severity: 'low' | 'medium' | 'high'
          description: string
          resolved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          chicken_id?: string | null
          coop_id?: string | null
          alert_type: 'disease' | 'injury' | 'behavior' | 'temperature' | 'water' | 'feed' | 'other'
          severity: 'low' | 'medium' | 'high'
          description: string
          resolved: boolean
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          chicken_id?: string | null
          coop_id?: string | null
          alert_type?: 'disease' | 'injury' | 'behavior' | 'temperature' | 'water' | 'feed' | 'other'
          severity?: 'low' | 'medium' | 'high'
          description?: string
          resolved?: boolean
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
