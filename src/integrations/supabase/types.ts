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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          restaurant_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          restaurant_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          restaurant_id?: string | null
          role?: string | null
          updated_at?: string | null
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
          updated_at?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_restaurant_staff:
        | {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
        | {
            Args: {
              restaurant_uuid: string
            }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
