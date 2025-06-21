export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cages: {
        Row: {
          capacity: number
          coop_id: string | null
          created_at: string
          current_occupancy: number
          id: string
          name: string
          new_chickens_count: number
          old_chickens_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity?: number
          coop_id?: string | null
          created_at?: string
          current_occupancy?: number
          id?: string
          name: string
          new_chickens_count?: number
          old_chickens_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity?: number
          coop_id?: string | null
          created_at?: string
          current_occupancy?: number
          id?: string
          name?: string
          new_chickens_count?: number
          old_chickens_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cages_coop_id_fkey"
            columns: ["coop_id"]
            isOneToOne: false
            referencedRelation: "coops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chickens: {
        Row: {
          acquisition_date: string
          age_weeks: number
          breed: string
          cage_id: string | null
          coop_id: string | null
          created_at: string
          health_status: Database["public"]["Enums"]["health_status"]
          id: string
          name: string
          notes: string | null
          updated_at: string
          user_id: string
          weight_grams: number | null
        }
        Insert: {
          acquisition_date?: string
          age_weeks?: number
          breed: string
          cage_id?: string | null
          coop_id?: string | null
          created_at?: string
          health_status?: Database["public"]["Enums"]["health_status"]
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
          weight_grams?: number | null
        }
        Update: {
          acquisition_date?: string
          age_weeks?: number
          breed?: string
          cage_id?: string | null
          coop_id?: string | null
          created_at?: string
          health_status?: Database["public"]["Enums"]["health_status"]
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chickens_cage_id_fkey"
            columns: ["cage_id"]
            isOneToOne: false
            referencedRelation: "cages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chickens_coop_id_fkey"
            columns: ["coop_id"]
            isOneToOne: false
            referencedRelation: "coops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chickens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coops: {
        Row: {
          capacity: number
          created_at: string
          current_occupancy: number
          humidity: number | null
          id: string
          last_cleaned: string
          name: string
          temperature: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          current_occupancy?: number
          humidity?: number | null
          id?: string
          last_cleaned?: string
          name: string
          temperature?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity?: number
          created_at?: string
          current_occupancy?: number
          humidity?: number | null
          id?: string
          last_cleaned?: string
          name?: string
          temperature?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_payments: {
        Row: {
          created_at: string
          credit_sale_id: string
          id: string
          notes: string | null
          payment_amount: number
          payment_date: string
          payment_method: string | null
        }
        Insert: {
          created_at?: string
          credit_sale_id: string
          id?: string
          notes?: string | null
          payment_amount: number
          payment_date: string
          payment_method?: string | null
        }
        Update: {
          created_at?: string
          credit_sale_id?: string
          id?: string
          notes?: string | null
          payment_amount?: number
          payment_date?: string
          payment_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_payments_credit_sale_id_fkey"
            columns: ["credit_sale_id"]
            isOneToOne: false
            referencedRelation: "credit_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_sales: {
        Row: {
          balance_amount: number | null
          created_at: string
          customer_address: string | null
          customer_name: string
          customer_phone: string | null
          due_date: string
          id: string
          items: Json | null
          notes: string | null
          paid_amount: number
          payment_status: Database["public"]["Enums"]["payment_status"]
          sale_date: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_amount?: number | null
          created_at?: string
          customer_address?: string | null
          customer_name: string
          customer_phone?: string | null
          due_date: string
          id?: string
          items?: Json | null
          notes?: string | null
          paid_amount?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          sale_date: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_amount?: number | null
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          customer_phone?: string | null
          due_date?: string
          id?: string
          items?: Json | null
          notes?: string | null
          paid_amount?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          sale_date?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      egg_collection_records: {
        Row: {
          buyer_name: string | null
          cage_id: string
          collection_date: string
          created_at: string
          damaged_count: number
          id: string
          is_from_new_chickens: boolean
          notes: string | null
          payment_due_date: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          price_per_unit: number | null
          sold_as: Database["public"]["Enums"]["sold_as_type"] | null
          sold_count: number
          spoiled_count: number
          total_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          buyer_name?: string | null
          cage_id: string
          collection_date: string
          created_at?: string
          damaged_count?: number
          id?: string
          is_from_new_chickens?: boolean
          notes?: string | null
          payment_due_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price_per_unit?: number | null
          sold_as?: Database["public"]["Enums"]["sold_as_type"] | null
          sold_count?: number
          spoiled_count?: number
          total_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          buyer_name?: string | null
          cage_id?: string
          collection_date?: string
          created_at?: string
          damaged_count?: number
          id?: string
          is_from_new_chickens?: boolean
          notes?: string | null
          payment_due_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price_per_unit?: number | null
          sold_as?: Database["public"]["Enums"]["sold_as_type"] | null
          sold_count?: number
          spoiled_count?: number
          total_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "egg_collection_records_cage_id_fkey"
            columns: ["cage_id"]
            isOneToOne: false
            referencedRelation: "cages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "egg_collection_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      environmental_logs: {
        Row: {
          air_quality_index: number | null
          coop_id: string | null
          created_at: string
          humidity: number | null
          id: string
          lighting_hours: number | null
          notes: string | null
          recorded_at: string
          temperature: number | null
          user_id: string
          ventilation_status: string | null
        }
        Insert: {
          air_quality_index?: number | null
          coop_id?: string | null
          created_at?: string
          humidity?: number | null
          id?: string
          lighting_hours?: number | null
          notes?: string | null
          recorded_at?: string
          temperature?: number | null
          user_id: string
          ventilation_status?: string | null
        }
        Update: {
          air_quality_index?: number | null
          coop_id?: string | null
          created_at?: string
          humidity?: number | null
          id?: string
          lighting_hours?: number | null
          notes?: string | null
          recorded_at?: string
          temperature?: number | null
          user_id?: string
          ventilation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environmental_logs_coop_id_fkey"
            columns: ["coop_id"]
            isOneToOne: false
            referencedRelation: "coops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "environmental_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          id: string
          is_recurring: boolean
          notes: string | null
          payment_method: string | null
          receipt_url: string | null
          recurring_frequency: string | null
          subcategory: string | null
          tags: string[] | null
          transaction_date: string
          updated_at: string
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          recurring_frequency?: string | null
          subcategory?: string | null
          tags?: string[] | null
          transaction_date: string
          updated_at?: string
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          recurring_frequency?: string | null
          subcategory?: string | null
          tags?: string[] | null
          transaction_date?: string
          updated_at?: string
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_consumption: {
        Row: {
          amount_kg: number
          consumption_date: string
          coop_id: string | null
          created_at: string
          feed_inventory_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount_kg?: number
          consumption_date: string
          coop_id?: string | null
          created_at?: string
          feed_inventory_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount_kg?: number
          consumption_date?: string
          coop_id?: string | null
          created_at?: string
          feed_inventory_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_consumption_coop_id_fkey"
            columns: ["coop_id"]
            isOneToOne: false
            referencedRelation: "coops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_consumption_feed_inventory_id_fkey"
            columns: ["feed_inventory_id"]
            isOneToOne: false
            referencedRelation: "feed_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_consumption_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_inventory: {
        Row: {
          brand: string | null
          cost_per_kg: number
          created_at: string
          current_stock_kg: number
          expiry_date: string | null
          feed_type: string
          id: string
          last_restocked: string
          notes: string | null
          reorder_level_kg: number
          supplier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          cost_per_kg?: number
          created_at?: string
          current_stock_kg?: number
          expiry_date?: string | null
          feed_type: string
          id?: string
          last_restocked?: string
          notes?: string | null
          reorder_level_kg?: number
          supplier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          cost_per_kg?: number
          created_at?: string
          current_stock_kg?: number
          expiry_date?: string | null
          feed_type?: string
          id?: string
          last_restocked?: string
          notes?: string | null
          reorder_level_kg?: number
          supplier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      health_alerts: {
        Row: {
          alert_date: string
          alert_type: Database["public"]["Enums"]["alert_type"]
          cage_id: string | null
          chicken_id: string | null
          coop_id: string | null
          created_at: string
          description: string
          id: string
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          resolution_notes: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_date?: string
          alert_type: Database["public"]["Enums"]["alert_type"]
          cage_id?: string | null
          chicken_id?: string | null
          coop_id?: string | null
          created_at?: string
          description: string
          id?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          resolution_notes?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_date?: string
          alert_type?: Database["public"]["Enums"]["alert_type"]
          cage_id?: string | null
          chicken_id?: string | null
          coop_id?: string | null
          created_at?: string
          description?: string
          id?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          resolution_notes?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_alerts_cage_id_fkey"
            columns: ["cage_id"]
            isOneToOne: false
            referencedRelation: "cages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_alerts_chicken_id_fkey"
            columns: ["chicken_id"]
            isOneToOne: false
            referencedRelation: "chickens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_alerts_coop_id_fkey"
            columns: ["coop_id"]
            isOneToOne: false
            referencedRelation: "coops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          farm_address: string | null
          farm_name: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          farm_address?: string | null
          farm_name?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          farm_address?: string | null
          farm_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          data: Json | null
          date_range_end: string | null
          date_range_start: string | null
          filters: Json | null
          generated_at: string
          id: string
          report_name: string
          report_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          date_range_end?: string | null
          date_range_start?: string | null
          filters?: Json | null
          generated_at?: string
          id?: string
          report_name: string
          report_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          date_range_end?: string | null
          date_range_start?: string | null
          filters?: Json | null
          generated_at?: string
          id?: string
          report_name?: string
          report_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      revenues: {
        Row: {
          amount: number
          category: string
          created_at: string
          customer_name: string | null
          description: string
          id: string
          invoice_number: string | null
          is_recurring: boolean
          notes: string | null
          payment_method: string | null
          recurring_frequency: string | null
          subcategory: string | null
          tags: string[] | null
          transaction_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          customer_name?: string | null
          description: string
          id?: string
          invoice_number?: string | null
          is_recurring?: boolean
          notes?: string | null
          payment_method?: string | null
          recurring_frequency?: string | null
          subcategory?: string | null
          tags?: string[] | null
          transaction_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          customer_name?: string | null
          description?: string
          id?: string
          invoice_number?: string | null
          is_recurring?: boolean
          notes?: string | null
          payment_method?: string | null
          recurring_frequency?: string | null
          subcategory?: string | null
          tags?: string[] | null
          transaction_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "low" | "medium" | "high"
      alert_type:
        | "disease"
        | "injury"
        | "behavior"
        | "temperature"
        | "water"
        | "feed"
        | "other"
      health_status: "healthy" | "sick" | "recovering" | "deceased"
      payment_status: "paid" | "pending" | "overdue"
      sold_as_type: "single" | "crate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const