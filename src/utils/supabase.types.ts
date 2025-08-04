// src/utils/supabase.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          can_list: boolean;
          avatar_url: string | null;
          inserted_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string;
          can_list?: boolean;
          avatar_url?: string;
          inserted_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          can_list?: boolean;
          avatar_url?: string;
          inserted_at?: string;
        };
      };
      boats: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: string | null;
          price: number;
          location: string | null;
          image_url: string | null;
          inserted_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string;
          name: string;
          type?: string;
          price: number;
          location?: string;
          image_url?: string;
          inserted_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          type?: string;
          price?: number;
          location?: string;
          image_url?: string;
          inserted_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
