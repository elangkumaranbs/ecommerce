-- SQL script to add some test products with hot sale flag
-- Run this in your Supabase SQL editor if no products are showing

-- First, check if we have any hot sale products
SELECT id, name, is_hot_sale, is_active FROM products WHERE is_hot_sale = true AND is_active = true;

-- If the above query returns no results, you can create some test products
-- Make sure to adjust the category_id values based on your actual categories

-- Insert test categories if they don't exist
INSERT INTO categories (name, slug, description) 
VALUES 
  ('Men', 'men', 'Men''s clothing collection'),
  ('Women', 'women', 'Women''s clothing collection'),
  ('Unisex', 'unisex', 'Unisex clothing collection')
ON CONFLICT (slug) DO NOTHING;

-- Insert test products
INSERT INTO products (name, description, category_id, price, original_price, sku, slug, is_active, is_hot_sale, rating, review_count)
VALUES 
  ('Men''s Premium Cotton T-Shirt', 'High-quality cotton t-shirt for men', 
   (SELECT id FROM categories WHERE slug = 'men' LIMIT 1), 
   599, 799, 'MEN-TSH-001', 'mens-premium-cotton-tshirt', true, true, 4.5, 125),
  ('Women''s Comfort Fit Leggings', 'Comfortable and stylish leggings for women',
   (SELECT id FROM categories WHERE slug = 'women' LIMIT 1), 
   899, 1199, 'WOM-LEG-001', 'womens-comfort-fit-leggings', true, true, 4.8, 89),
  ('Unisex Polo Shirt', 'Classic polo shirt suitable for all',
   (SELECT id FROM categories WHERE slug = 'unisex' LIMIT 1), 
   749, 999, 'UNI-POL-001', 'unisex-polo-shirt', true, true, 4.3, 67)
ON CONFLICT (slug) DO NOTHING;

-- Add product images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT 
  p.id,
  CASE 
    WHEN p.slug = 'mens-premium-cotton-tshirt' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&crop=center'
    WHEN p.slug = 'womens-comfort-fit-leggings' THEN 'https://images.unsplash.com/photo-1506629905057-c28cac1b5ba0?w=400&h=600&fit=crop&crop=center'
    WHEN p.slug = 'unisex-polo-shirt' THEN 'https://images.unsplash.com/photo-1583743814966-8936f37f4569?w=400&h=600&fit=crop&crop=center'
  END as image_url,
  p.name as alt_text,
  true as is_primary,
  1 as sort_order
FROM products p
WHERE p.slug IN ('mens-premium-cotton-tshirt', 'womens-comfort-fit-leggings', 'unisex-polo-shirt')
ON CONFLICT DO NOTHING;

-- Add product variants
INSERT INTO product_variants (product_id, size, color_name, color_code, stock_quantity, price_adjustment, is_active)
SELECT 
  p.id,
  unnest(ARRAY['S', 'M', 'L', 'XL']) as size,
  'Black' as color_name,
  '#000000' as color_code,
  50 as stock_quantity,
  0 as price_adjustment,
  true as is_active
FROM products p
WHERE p.slug IN ('mens-premium-cotton-tshirt', 'womens-comfort-fit-leggings', 'unisex-polo-shirt')
ON CONFLICT DO NOTHING;
