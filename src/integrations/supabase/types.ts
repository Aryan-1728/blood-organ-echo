export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      donor_matches: {
        Row: {
          ai_recommendation: string | null
          compatibility_score: number | null
          distance_km: number | null
          donor_id: string
          id: string
          match_created_at: string | null
          sos_request_id: string
        }
        Insert: {
          ai_recommendation?: string | null
          compatibility_score?: number | null
          distance_km?: number | null
          donor_id: string
          id?: string
          match_created_at?: string | null
          sos_request_id: string
        }
        Update: {
          ai_recommendation?: string | null
          compatibility_score?: number | null
          distance_km?: number | null
          donor_id?: string
          id?: string
          match_created_at?: string | null
          sos_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_matches_sos_request_id_fkey"
            columns: ["sos_request_id"]
            isOneToOne: false
            referencedRelation: "sos_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_medical_profiles: {
        Row: {
          age: number
          available_for_donation: boolean | null
          blood_type: Database["public"]["Enums"]["blood_type"]
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          height: number | null
          id: string
          last_donation_date: string | null
          medical_conditions: string[] | null
          medications: string[] | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          age: number
          available_for_donation?: boolean | null
          blood_type: Database["public"]["Enums"]["blood_type"]
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          height?: number | null
          id?: string
          last_donation_date?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number
          available_for_donation?: boolean | null
          blood_type?: Database["public"]["Enums"]["blood_type"]
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          height?: number | null
          id?: string
          last_donation_date?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"] | null
          collection_date: string | null
          created_at: string | null
          donor_id: string | null
          expiry_date: string | null
          id: string
          notes: string | null
          organ_type: Database["public"]["Enums"]["organ_type"] | null
          provider_id: string
          quantity: number | null
          status: Database["public"]["Enums"]["inventory_status"] | null
          updated_at: string | null
        }
        Insert: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          collection_date?: string | null
          created_at?: string | null
          donor_id?: string | null
          expiry_date?: string | null
          id?: string
          notes?: string | null
          organ_type?: Database["public"]["Enums"]["organ_type"] | null
          provider_id: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          updated_at?: string | null
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          collection_date?: string | null
          created_at?: string | null
          donor_id?: string | null
          expiry_date?: string | null
          id?: string
          notes?: string | null
          organ_type?: Database["public"]["Enums"]["organ_type"] | null
          provider_id?: string
          quantity?: number | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          priority: Database["public"]["Enums"]["sos_priority"] | null
          read: boolean | null
          sos_request_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          priority?: Database["public"]["Enums"]["sos_priority"] | null
          read?: boolean | null
          sos_request_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          priority?: Database["public"]["Enums"]["sos_priority"] | null
          read?: boolean | null
          sos_request_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_sos_request_id_fkey"
            columns: ["sos_request_id"]
            isOneToOne: false
            referencedRelation: "sos_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          full_name: string
          id: string
          latitude: number | null
          license_number: string | null
          longitude: number | null
          organization_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          organization_name?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          organization_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      sos_requests: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"] | null
          contact_phone: string
          created_at: string | null
          description: string | null
          id: string
          latitude: number
          location_name: string
          longitude: number
          organ_type: Database["public"]["Enums"]["organ_type"] | null
          patient_age: number | null
          patient_name: string
          priority: Database["public"]["Enums"]["sos_priority"]
          requester_id: string
          status: Database["public"]["Enums"]["sos_status"]
          updated_at: string | null
        }
        Insert: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          contact_phone: string
          created_at?: string | null
          description?: string | null
          id?: string
          latitude: number
          location_name: string
          longitude: number
          organ_type?: Database["public"]["Enums"]["organ_type"] | null
          patient_age?: number | null
          patient_name: string
          priority?: Database["public"]["Enums"]["sos_priority"]
          requester_id: string
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string | null
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          contact_phone?: string
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          organ_type?: Database["public"]["Enums"]["organ_type"] | null
          patient_age?: number | null
          patient_name?: string
          priority?: Database["public"]["Enums"]["sos_priority"]
          requester_id?: string
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sos_responses: {
        Row: {
          created_at: string | null
          estimated_arrival: string | null
          id: string
          message: string | null
          responder_id: string
          sos_request_id: string
        }
        Insert: {
          created_at?: string | null
          estimated_arrival?: string | null
          id?: string
          message?: string | null
          responder_id: string
          sos_request_id: string
        }
        Update: {
          created_at?: string | null
          estimated_arrival?: string | null
          id?: string
          message?: string | null
          responder_id?: string
          sos_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_responses_sos_request_id_fkey"
            columns: ["sos_request_id"]
            isOneToOne: false
            referencedRelation: "sos_requests"
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
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      inventory_status: "available" | "reserved" | "expired" | "used"
      organ_type:
        | "kidney"
        | "liver"
        | "heart"
        | "lung"
        | "pancreas"
        | "cornea"
        | "bone_marrow"
        | "skin"
        | "bone"
      sos_priority: "low" | "medium" | "high" | "critical"
      sos_status:
        | "active"
        | "acknowledged"
        | "responding"
        | "resolved"
        | "cancelled"
      user_role: "donor" | "hospital" | "blood_bank" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      inventory_status: ["available", "reserved", "expired", "used"],
      organ_type: [
        "kidney",
        "liver",
        "heart",
        "lung",
        "pancreas",
        "cornea",
        "bone_marrow",
        "skin",
        "bone",
      ],
      sos_priority: ["low", "medium", "high", "critical"],
      sos_status: [
        "active",
        "acknowledged",
        "responding",
        "resolved",
        "cancelled",
      ],
      user_role: ["donor", "hospital", "blood_bank", "admin"],
    },
  },
} as const
