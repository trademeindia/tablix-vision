
export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  bio?: string;
  website?: string;
  profile_image_url?: string;
  role?: string;
  restaurant_id?: string;
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
