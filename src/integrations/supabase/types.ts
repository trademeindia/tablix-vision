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
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          last_visit: string | null
          name: string | null
          phone: string | null
          total_expenditure: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          name?: string | null
          phone?: string | null
          total_expenditure?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          name?: string | null
          phone?: string | null
          total_expenditure?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          description: string | null
          discount_percentage: number | null
          id: string
          invoice_id: string
          name: string
          quantity: number
          tax_percentage: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          description?: string | null
          discount_percentage?: number | null
          id?: string
          invoice_id: string
          name: string
          quantity: number
          tax_percentage?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string | null
          discount_percentage?: number | null
          id?: string
          invoice_id?: string
          name?: string
          quantity?: number
          tax_percentage?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          discount_amount: number
          final_amount: number
          id: string
          invoice_number: string
          notes: string | null
          order_id: string | null
          payment_method: string | null
          payment_reference: string | null
          restaurant_id: string | null
          status: string
          tax_amount: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number
          final_amount?: number
          id?: string
          invoice_number: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          restaurant_id?: string | null
          status?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number
          final_amount?: number
          id?: string
          invoice_number?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          restaurant_id?: string | null
          status?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          ai_generated: boolean | null
          content: string | null
          created_at: string | null
          description: string | null
          generation_prompt: string | null
          id: string
          metrics: Json | null
          name: string
          restaurant_id: string | null
          scheduled_at: string | null
          status: string | null
          target_audience: string | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          generation_prompt?: string | null
          id?: string
          metrics?: Json | null
          name: string
          restaurant_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          target_audience?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          ai_generated?: boolean | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          generation_prompt?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          restaurant_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          target_audience?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          restaurant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          restaurant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          restaurant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: Json | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          ingredients: Json | null
          is_available: boolean | null
          is_featured: boolean | null
          media_reference: string | null
          media_type: string | null
          model_url: string | null
          name: string
          nutritional_info: Json | null
          preparation_time: number | null
          price: number
          restaurant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergens?: Json | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          is_available?: boolean | null
          is_featured?: boolean | null
          media_reference?: string | null
          media_type?: string | null
          model_url?: string | null
          name: string
          nutritional_info?: Json | null
          preparation_time?: number | null
          price: number
          restaurant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          allergens?: Json | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          is_available?: boolean | null
          is_featured?: boolean | null
          media_reference?: string | null
          media_type?: string | null
          model_url?: string | null
          name?: string
          nutritional_info?: Json | null
          preparation_time?: number | null
          price?: number
          restaurant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          alpha3d_asset_id: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          menu_item_id: string | null
          meshy_model_id: string | null
          model_url: string | null
          name: string
          original_image_url: string | null
          restaurant_id: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alpha3d_asset_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          menu_item_id?: string | null
          meshy_model_id?: string | null
          model_url?: string | null
          name: string
          original_image_url?: string | null
          restaurant_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          alpha3d_asset_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          menu_item_id?: string | null
          meshy_model_id?: string | null
          model_url?: string | null
          name?: string
          original_image_url?: string | null
          restaurant_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          customizations: Json | null
          id: string
          menu_item_id: string | null
          name: string
          order_id: string | null
          price: number
          quantity: number
          special_instructions: string | null
        }
        Insert: {
          created_at?: string | null
          customizations?: Json | null
          id?: string
          menu_item_id?: string | null
          name: string
          order_id?: string | null
          price: number
          quantity: number
          special_instructions?: string | null
        }
        Update: {
          created_at?: string | null
          customizations?: Json | null
          id?: string
          menu_item_id?: string | null
          name?: string
          order_id?: string | null
          price?: number
          quantity?: number
          special_instructions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          restaurant_id: string | null
          special_instructions: string | null
          status: string | null
          table_id: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          restaurant_id?: string | null
          special_instructions?: string | null
          status?: string | null
          table_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          restaurant_id?: string | null
          special_instructions?: string | null
          status?: string | null
          table_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      password_failed_verification_attempts: {
        Row: {
          created_at: string | null
          id: number
          last_failed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          last_failed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          last_failed_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
          profile_image_url: string | null
          restaurant_id: string | null
          role: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json | null
          profile_image_url?: string | null
          restaurant_id?: string | null
          role?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          profile_image_url?: string | null
          restaurant_id?: string | null
          role?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          google_drive_folder_id: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          google_drive_folder_id?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string
          phone?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          google_drive_folder_id?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          avatar: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          emergency_contact: string | null
          hire_date: string | null
          id: string
          image: string | null
          last_login: string | null
          manager_id: string | null
          name: string
          notification_preference: Json | null
          phone: string
          restaurant_id: string | null
          role: string
          salary: number | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          emergency_contact?: string | null
          hire_date?: string | null
          id?: string
          image?: string | null
          last_login?: string | null
          manager_id?: string | null
          name: string
          notification_preference?: Json | null
          phone: string
          restaurant_id?: string | null
          role: string
          salary?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          emergency_contact?: string | null
          hire_date?: string | null
          id?: string
          image?: string | null
          last_login?: string | null
          manager_id?: string | null
          name?: string
          notification_preference?: Json | null
          phone?: string
          restaurant_id?: string | null
          role?: string
          salary?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      staff_attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          date: string
          id: string
          notes: string | null
          staff_id: string | null
          status: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          date: string
          id?: string
          notes?: string | null
          staff_id?: string | null
          status: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          date?: string
          id?: string
          notes?: string | null
          staff_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_payroll: {
        Row: {
          base_salary: number
          bonus: number
          deductions: number
          id: string
          net_salary: number
          payment_date: string
          period: string
          staff_id: string | null
          status: string
        }
        Insert: {
          base_salary: number
          bonus?: number
          deductions?: number
          id?: string
          net_salary: number
          payment_date: string
          period: string
          staff_id?: string | null
          status: string
        }
        Update: {
          base_salary?: number
          bonus?: number
          deductions?: number
          id?: string
          net_salary?: number
          payment_date?: string
          period?: string
          staff_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_payroll_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_shifts: {
        Row: {
          date: string
          end_time: string
          id: string
          notes: string | null
          position: string
          staff_id: string | null
          start_time: string
          status: string
        }
        Insert: {
          date: string
          end_time: string
          id?: string
          notes?: string | null
          position: string
          staff_id?: string | null
          start_time: string
          status: string
        }
        Update: {
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          position?: string
          staff_id?: string | null
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_shifts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          created_at: string | null
          id: string
          number: number
          qr_code_url: string | null
          restaurant_id: string | null
          seats: number
          section: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          number: number
          qr_code_url?: string | null
          restaurant_id?: string | null
          seats: number
          section?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          number?: number
          qr_code_url?: string | null
          restaurant_id?: string | null
          seats?: number
          section?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: number
          task: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: never
          task: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: never
          task?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      waiter_requests: {
        Row: {
          acknowledgement_time: string | null
          completion_time: string | null
          customer_id: string | null
          id: string
          request_time: string
          restaurant_id: string | null
          status: string
          table_number: string
        }
        Insert: {
          acknowledgement_time?: string | null
          completion_time?: string | null
          customer_id?: string | null
          id?: string
          request_time?: string
          restaurant_id?: string | null
          status?: string
          table_number: string
        }
        Update: {
          acknowledgement_time?: string | null
          completion_time?: string | null
          customer_id?: string | null
          id?: string
          request_time?: string
          restaurant_id?: string | null
          status?: string
          table_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "waiter_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waiter_requests_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_restaurant_staff: {
        Args: Record<PropertyKey, never> | { restaurant_uuid: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
