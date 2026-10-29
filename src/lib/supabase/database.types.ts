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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      daily_challenges: {
        Row: {
          challenge_date: string
          created_at: string
          id: string
          is_published: boolean
          question_id: string
        }
        Insert: {
          challenge_date: string
          created_at?: string
          id?: string
          is_published?: boolean
          question_id: string
        }
        Update: {
          challenge_date?: string
          created_at?: string
          id?: string
          is_published?: boolean
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenges_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "practice_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_calendar: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          scheduled_at: string
          school_id: string | null
          slug: string
          subject_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          scheduled_at: string
          school_id?: string | null
          slug: string
          subject_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          scheduled_at?: string
          school_id?: string | null
          slug?: string
          subject_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_calendar_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_calendar_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      guardian_links: {
        Row: {
          created_at: string
          guardian_user_id: string
          id: string
          status: string
          student_user_id: string
        }
        Insert: {
          created_at?: string
          guardian_user_id: string
          id?: string
          status?: string
          student_user_id: string
        }
        Update: {
          created_at?: string
          guardian_user_id?: string
          id?: string
          status?: string
          student_user_id?: string
        }
        Relationships: []
      }
      learning_activity: {
        Row: {
          activity_type: string
          details: Json
          id: string
          occurred_at: string
          reference_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          details?: Json
          id?: string
          occurred_at?: string
          reference_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          details?: Json
          id?: string
          occurred_at?: string
          reference_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lesson_bookmarks: {
        Row: {
          created_at: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_bookmarks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          body_markdown: string
          created_at: string
          created_by: string | null
          estimated_minutes: number
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          summary: string
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          body_markdown?: string
          created_at?: string
          created_by?: string | null
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          summary?: string
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          body_markdown?: string
          created_at?: string
          created_by?: string | null
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          summary?: string
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_answer_keys: {
        Row: {
          correct_option_key: string
          question_id: string
        }
        Insert: {
          correct_option_key: string
          question_id: string
        }
        Update: {
          correct_option_key?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_answer_keys_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "practice_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_questions: {
        Row: {
          created_at: string
          created_by: string | null
          difficulty: string
          explanation: string
          id: string
          is_published: boolean
          options: Json
          prompt: string
          slug: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string
          id?: string
          is_published?: boolean
          options: Json
          prompt: string
          slug: string
          topic_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string
          id?: string
          is_published?: boolean
          options?: Json
          prompt?: string
          slug?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          grade_level: string | null
          learning_preferences: Json
          locale: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          grade_level?: string | null
          learning_preferences?: Json
          locale?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          grade_level?: string | null
          learning_preferences?: Json
          locale?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          daily_challenge_id: string
          id: string
          is_correct: boolean
          question_id: string
          selected_option_key: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          daily_challenge_id: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_option_key: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          daily_challenge_id?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_option_key?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_daily_challenge_id_fkey"
            columns: ["daily_challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "practice_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_memberships: {
        Row: {
          created_at: string
          id: string
          role: string
          school_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          school_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          school_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_memberships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          id: string
          name: string
          region: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          region?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          name: string
          slug: string
          sort_order: number
          subject_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name: string
          slug: string
          sort_order?: number
          subject_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name?: string
          slug?: string
          sort_order?: number
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          awarded_at: string
          badge_key: string
          details: Json
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_key: string
          details?: Json
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_key?: string
          details?: Json
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      submit_daily_quiz_answer: {
        Args: { p_challenge_id: string; p_selected_option_key: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
