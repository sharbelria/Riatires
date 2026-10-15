// Generated from the Supabase project schema (tables in supabase/migrations).
// Regenerate after schema changes: Supabase dashboard → API Docs, or `supabase gen types typescript`.

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      contact_requests: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          name: string;
          phone: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          name: string;
          phone: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          name?: string;
          phone?: string;
          status?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          brand: string;
          id: string;
          line_total: number;
          model: string;
          order_number: string;
          qty: number;
          size: string;
          tire_id: string;
          unit_price: number;
        };
        Insert: {
          brand: string;
          id?: string;
          line_total: number;
          model: string;
          order_number: string;
          qty: number;
          size: string;
          tire_id: string;
          unit_price: number;
        };
        Update: {
          brand?: string;
          id?: string;
          line_total?: number;
          model?: string;
          order_number?: string;
          qty?: number;
          size?: string;
          tire_id?: string;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_number_fkey";
            columns: ["order_number"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["order_number"];
          },
        ];
      };
      order_payments: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          order_number: string;
          provider: string;
          transaction_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          order_number: string;
          provider: string;
          transaction_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          order_number?: string;
          provider?: string;
          transaction_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_payments_order_number_fkey";
            columns: ["order_number"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["order_number"];
          },
        ];
      };
      orders: {
        Row: {
          city: string;
          created_at: string;
          customer_name: string;
          email: string | null;
          id: string;
          notes: string | null;
          order_number: string;
          payment_method: string;
          phone: string;
          status: string;
          total: number;
        };
        Insert: {
          city: string;
          created_at?: string;
          customer_name: string;
          email?: string | null;
          id?: string;
          notes?: string | null;
          order_number: string;
          payment_method: string;
          phone: string;
          status?: string;
          total: number;
        };
        Update: {
          city?: string;
          created_at?: string;
          customer_name?: string;
          email?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: string;
          payment_method?: string;
          phone?: string;
          status?: string;
          total?: number;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
