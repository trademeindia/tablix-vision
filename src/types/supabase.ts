
export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone_number: string | null;
          owner_id: string | null;
          theme_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone_number?: string | null;
          owner_id?: string | null;
          theme_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone_number?: string | null;
          owner_id?: string | null;
          theme_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          media_type: string | null;
          media_path: string | null;
          external_media_url: string | null;
          is_vegetarian: boolean;
          is_vegan: boolean;
          is_gluten_free: boolean;
          allergens: string[] | null;
          is_available: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          media_type?: string | null;
          media_path?: string | null;
          external_media_url?: string | null;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          is_gluten_free?: boolean;
          allergens?: string[] | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          media_type?: string | null;
          media_path?: string | null;
          external_media_url?: string | null;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          is_gluten_free?: boolean;
          allergens?: string[] | null;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string;
          customer_id: string | null;
          table_id: string | null;
          order_date: string;
          total_amount: number;
          status: string;
          payment_status: string;
          payment_gateway_ref: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          customer_id?: string | null;
          table_id?: string | null;
          order_date?: string;
          total_amount: number;
          status?: string;
          payment_status?: string;
          payment_gateway_ref?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          customer_id?: string | null;
          table_id?: string | null;
          order_date?: string;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          payment_gateway_ref?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tables: {
        Row: {
          id: string;
          restaurant_id: string;
          table_number: string;
          qr_code_id: string | null;
          capacity: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_number: string;
          qr_code_id?: string | null;
          capacity?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          table_number?: string;
          qr_code_id?: string | null;
          capacity?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
