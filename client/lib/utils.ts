import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for product data processing
export interface ColorOption {
  name: string;
  color: string;
}

export interface ProductVariant {
  id: string;
  size: string | null;
  color_name: string | null;
  color_code: string | null;
  stock_quantity: number;
  price_adjustment: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

/**
 * Extract available colors from product variants
 * Only returns colors that have both name and color code from active variants
 */
export function getProductColors(variants?: ProductVariant[]): ColorOption[] {
  if (!variants) return [];
  
  return variants
    .filter((v) => v.color_code && v.color_name && v.is_active)
    .map((v) => ({
      name: v.color_name!,
      color: v.color_code!,
    }))
    // Remove duplicates based on color code
    .filter((color, index, arr) => 
      arr.findIndex(c => c.color === color.color) === index
    );
}

/**
 * Get the primary product image or fallback to first available image
 */
export function getProductImage(images?: ProductImage[]): string {
  if (!images || images.length === 0) return '/placeholder.svg';
  
  const primaryImage = images.find(img => img.is_primary);
  return primaryImage?.image_url || images[0]?.image_url || '/placeholder.svg';
}

/**
 * Get available sizes from product variants
 * Only returns sizes from active variants, removes duplicates
 */
export function getProductSizes(variants?: ProductVariant[]): string[] {
  if (!variants) return [];
  
  return variants
    .filter((v) => v.size && v.is_active)
    .map((v) => v.size!)
    .filter((size, index, arr) => arr.indexOf(size) === index)
    .sort();
}
