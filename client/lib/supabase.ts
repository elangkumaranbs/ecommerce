import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only log environment check once in development
if (import.meta.env.DEV) {
  console.log("Supabase Environment Check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "undefined",
  });
}

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Missing Supabase environment variables. Please check your .env file.",
  );
  console.error(
    "Expected variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY",
  );
  // Instead of throwing an error, create a dummy client to prevent crashes
  supabase = createClient("https://dummy.supabase.co", "dummy-key");
} else {
  console.log("✅ Supabase client initialized successfully");
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

// Cache connection test result to avoid repeated calls
let connectionTestCache: { result: boolean; timestamp: number } | null = null;
const CONNECTION_TEST_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Test connection to Supabase with caching
export const testSupabaseConnection = async (forceRefresh = false) => {
  // Return cached result if available and not expired
  if (!forceRefresh && connectionTestCache) {
    const isExpired = Date.now() - connectionTestCache.timestamp > CONNECTION_TEST_CACHE_DURATION;
    if (!isExpired) {
      return connectionTestCache.result;
    }
  }

  try {
    // Try a simple query to test the connection
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    const isConnected = !error;
    
    // Cache the result
    connectionTestCache = {
      result: isConnected,
      timestamp: Date.now()
    };

    if (error) {
      console.error("❌ Supabase connection test failed:", error);
    } else {
      console.log("✅ Supabase connection test successful");
    }

    return isConnected;
  } catch (err) {
    console.error("❌ Supabase connection test error:", err);
    
    // Cache the failure
    connectionTestCache = {
      result: false,
      timestamp: Date.now()
    };
    
    return false;
  }
};

// Debug function to check Supabase connection and available data
export const debugSupabaseConnection = async () => {
  console.log("🔍 Debug: Testing Supabase connection...");
  
  try {
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from("products")
      .select("count")
      .limit(1);
    
    if (healthError) {
      console.error("❌ Health check failed:", healthError);
      return { connected: false, error: healthError };
    }
    
    console.log("✅ Health check passed");
    
    // Check available tables and data
    const tables = ['products', 'categories', 'product_images', 'product_variants'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);
          
        if (error) {
          console.warn(`⚠️ Table ${table} error:`, error);
          results[table] = { error: error.message };
        } else {
          console.log(`✅ Table ${table}: ${count} records`);
          results[table] = { count, sample: data?.[0] };
        }
      } catch (err) {
        console.error(`❌ Error checking table ${table}:`, err);
        results[table] = { error: err.message };
      }
    }
    
    return { connected: true, tables: results };
  } catch (err) {
    console.error("❌ Debug connection failed:", err);
    return { connected: false, error: err };
  }
};

export { supabase };

// Auto-test connection on first import (development only)
if (import.meta.env.DEV && supabaseUrl && supabaseAnonKey) {
  debugSupabaseConnection();
}

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          date_of_birth: string | null;
          gender: "male" | "female" | "other" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: "male" | "female" | "other" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: "male" | "female" | "other" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          slug: string;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          slug: string;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          slug?: string;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category_id: string | null;
          price: number;
          original_price: number | null;
          sku: string | null;
          slug: string;
          is_active: boolean;
          is_hot_sale: boolean;
          rating: number;
          review_count: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category_id?: string | null;
          price: number;
          original_price?: number | null;
          sku?: string | null;
          slug: string;
          is_active?: boolean;
          is_hot_sale?: boolean;
          rating?: number;
          review_count?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category_id?: string | null;
          price?: number;
          original_price?: number | null;
          sku?: string | null;
          slug?: string;
          is_active?: boolean;
          is_hot_sale?: boolean;
          rating?: number;
          review_count?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string | null;
          color_name: string | null;
          color_code: string | null;
          sku: string | null;
          stock_quantity: number;
          price_adjustment: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size?: string | null;
          color_name?: string | null;
          color_code?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          price_adjustment?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: string | null;
          color_name?: string | null;
          color_code?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          price_adjustment?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          subtotal: number;
          tax_amount: number;
          shipping_amount: number;
          discount_amount: number;
          total_amount: number;
          currency: string;
          payment_method: "razorpay" | "cod" | "upi" | "card" | null;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          shipping_address: any | null;
          billing_address: any | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number?: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          subtotal?: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          currency?: string;
          payment_method?: "razorpay" | "cod" | "upi" | "card" | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          shipping_address?: any | null;
          billing_address?: any | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          subtotal?: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          currency?: string;
          payment_method?: "razorpay" | "cod" | "upi" | "card" | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          shipping_address?: any | null;
          billing_address?: any | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
