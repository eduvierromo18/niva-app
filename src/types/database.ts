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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          alias: string | null
          bank_custom_name: string | null
          bank_name: string | null
          color: string | null
          created_at: string
          currency_code: string
          icon: string | null
          id: string
          initial_balance: number
          is_archived: boolean
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          alias?: string | null
          bank_custom_name?: string | null
          bank_name?: string | null
          color?: string | null
          created_at?: string
          currency_code?: string
          icon?: string | null
          id?: string
          initial_balance?: number
          is_archived?: boolean
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          alias?: string | null
          bank_custom_name?: string | null
          bank_name?: string | null
          color?: string | null
          created_at?: string
          currency_code?: string
          icon?: string | null
          id?: string
          initial_balance?: number
          is_archived?: boolean
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          is_archived: boolean
          name: string
          parent_id: string | null
          sort_order: number
          type: Database["public"]["Enums"]["category_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_archived?: boolean
          name: string
          parent_id?: string | null
          sort_order?: number
          type: Database["public"]["Enums"]["category_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          parent_id?: string | null
          sort_order?: number
          type?: Database["public"]["Enums"]["category_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_owner_fkey"
            columns: ["parent_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      liabilities: {
        Row: {
          account_id: string | null
          apr: number | null
          created_at: string
          credit_limit: number | null
          id: string
          name: string
          notes: string | null
          payment_due_day: number | null
          principal_amount: number
          statement_closing_day: number | null
          status: Database["public"]["Enums"]["liability_status"]
          type: Database["public"]["Enums"]["liability_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          apr?: number | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          name: string
          notes?: string | null
          payment_due_day?: number | null
          principal_amount?: number
          statement_closing_day?: number | null
          status?: Database["public"]["Enums"]["liability_status"]
          type: Database["public"]["Enums"]["liability_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          apr?: number | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          name?: string
          notes?: string | null
          payment_due_day?: number | null
          principal_amount?: number
          statement_closing_day?: number | null
          status?: Database["public"]["Enums"]["liability_status"]
          type?: Database["public"]["Enums"]["liability_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liabilities_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "liabilities_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "liabilities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_budgets: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          id: string
          month: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          id?: string
          month: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          id?: string
          month?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_budgets_category_owner_fkey"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "monthly_budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      movements: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          created_at: string
          description: string | null
          from_account_id: string | null
          id: string
          is_recurring: boolean
          merchant: string | null
          notes: string | null
          occurred_on: string
          to_account_id: string | null
          type: Database["public"]["Enums"]["movement_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          from_account_id?: string | null
          id?: string
          is_recurring?: boolean
          merchant?: string | null
          notes?: string | null
          occurred_on?: string
          to_account_id?: string | null
          type: Database["public"]["Enums"]["movement_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          from_account_id?: string | null
          id?: string
          is_recurring?: boolean
          merchant?: string | null
          notes?: string | null
          occurred_on?: string
          to_account_id?: string | null
          type?: Database["public"]["Enums"]["movement_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movements_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_category_owner_fkey"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_from_account_owner_fkey"
            columns: ["from_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_from_account_owner_fkey"
            columns: ["from_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_to_account_owner_fkey"
            columns: ["to_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_to_account_owner_fkey"
            columns: ["to_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          currency_code: string
          full_name: string | null
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          currency_code?: string
          full_name?: string | null
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          currency_code?: string
          full_name?: string | null
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          account_id: string | null
          color: string | null
          created_at: string
          current_amount: number
          id: string
          name: string
          status: Database["public"]["Enums"]["goal_status"]
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          color?: string | null
          created_at?: string
          current_amount?: number
          id?: string
          name: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          color?: string | null
          created_at?: string
          current_amount?: number
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_goals_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "savings_goals_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "savings_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_transactions: {
        Row: {
          account_id: string | null
          amount: number
          auto_create: boolean
          category_id: string | null
          created_at: string
          destination_account_id: string | null
          end_date: string | null
          frequency: string
          id: string
          name: string
          next_due_date: string
          notes: string | null
          start_date: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          auto_create?: boolean
          category_id?: string | null
          created_at?: string
          destination_account_id?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          name: string
          next_due_date: string
          notes?: string | null
          start_date: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          auto_create?: boolean
          category_id?: string | null
          created_at?: string
          destination_account_id?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          name?: string
          next_due_date?: string
          notes?: string | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_transactions_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scheduled_transactions_account_owner_fkey"
            columns: ["account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scheduled_transactions_category_owner_fkey"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scheduled_transactions_destination_account_owner_fkey"
            columns: ["destination_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scheduled_transactions_destination_account_owner_fkey"
            columns: ["destination_account_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string
          id: string
          invited_email: string
          invited_name: string
          invited_user_id: string | null
          owner_id: string
          role: string
          status: Database["public"]["Enums"]["invitation_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          invited_email: string
          invited_name: string
          invited_user_id?: string | null
          owner_id: string
          role?: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Update: {
          created_at?: string
          id?: string
          invited_email?: string
          invited_name?: string
          invited_user_id?: string | null
          owner_id?: string
          role?: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      account_balances: {
        Row: {
          alias: string | null
          balance: number | null
          bank_custom_name: string | null
          bank_name: string | null
          color: string | null
          created_at: string | null
          currency_code: string | null
          icon: string | null
          id: string | null
          initial_balance: number | null
          is_archived: boolean | null
          name: string | null
          type: Database["public"]["Enums"]["account_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      category_spending_summary: {
        Row: {
          amount: number | null
          category_color: string | null
          category_id: string | null
          category_name: string | null
          month: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movements_category_owner_fkey"
            columns: ["category_id", "user_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_financial_summary: {
        Row: {
          expenses: number | null
          income: number | null
          month: string | null
          movement_count: number | null
          savings: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      confirm_scheduled_transaction: {
        Args: { p_scheduled_id: string }
        Returns: string
      }
    }
    Enums: {
      account_type:
        | "cash"
        | "checking"
        | "savings"
        | "credit_card"
        | "loan"
        | "investment"
        | "other"
      category_type: "income" | "expense"
      goal_status: "active" | "paused" | "completed" | "cancelled"
      invitation_status: "created" | "revoked"
      liability_status: "active" | "paid" | "closed"
      liability_type: "credit_card" | "loan" | "personal_debt" | "other"
      movement_type: "income" | "expense" | "transfer"
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
      account_type: [
        "cash",
        "checking",
        "savings",
        "credit_card",
        "loan",
        "investment",
        "other",
      ],
      category_type: ["income", "expense"],
      goal_status: ["active", "paused", "completed", "cancelled"],
      invitation_status: ["created", "revoked"],
      liability_status: ["active", "paid", "closed"],
      liability_type: ["credit_card", "loan", "personal_debt", "other"],
      movement_type: ["income", "expense", "transfer"],
    },
  },
} as const
