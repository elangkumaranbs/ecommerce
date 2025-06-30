import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductRow } from "./ui/product-card";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface BestSellingProps {
  onAddToCart?: (product: {
    id: string;
    name: string;
    price: number;
    size?: string;
    image?: string;
  }) => void;
  onProductClick?: (productId: string) => void;
}

export default function BestSelling({
  onAddToCart,
  onProductClick,
}: BestSellingProps) {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getHotSaleProducts } = useProducts();
  const { addToCart: addToDbCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        console.log("🛒 BestSelling: Fetching hot sale products...");
        const hotSaleProducts = await getHotSaleProducts();
        console.log("🛒 BestSelling: Received products:", hotSaleProducts.length);
        console.log("🛒 BestSelling: Sample product:", hotSaleProducts[0]);
        setBestSellingProducts(hotSaleProducts);
      } catch (error) {
        console.error(
          "Error fetching hot sale products:",
          error instanceof Error ? error.message : String(error),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, [getHotSaleProducts]);

  // Convert database products to the format expected by ProductRow
  const products = bestSellingProducts.map((product) => {
    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    const imageUrl = primaryImage?.image_url || "/placeholder.svg";
    
    console.log(`🖼️ Product "${product.name}":`, {
      id: product.id,
      category: product.category?.name,
      subcategory: product.subcategory,
      price: product.price,
      imageUrl,
      variantsCount: product.variants?.length || 0,
      colorsCount: product.variants?.filter(v => v.color_code).length || 0
    });
    
    // Get actual colors from variants
    const availableColors = product.variants
      ?.filter((v) => v.color_code && v.color_name && v.is_active)
      .map((v) => ({
        name: v.color_name!,
        color: v.color_code!,
      })) || [];

    // Get actual sizes from variants  
    const availableSizes = product.variants
      ?.filter((v) => v.size && v.is_active)
      .map((v) => v.size!)
      .filter((size, index, arr) => arr.indexOf(size) === index) // Remove duplicates
      || [];
    
    return {
      id: parseInt(product.id),
      name: product.name,
      price: `Rs. ${product.price.toLocaleString()}.00`,
      image: imageUrl,
      rating: product.rating || 4.0,
      colors: availableColors,
      sizes: availableSizes,
      category: product.category?.name || "Uncategorized",
      subcategory: product.subcategory || "",
      description: product.description || "",
      originalPrice: product.original_price,
      isHotSale: product.is_hot_sale
    };
  });

  const handleProductClick = (productId: number) => {
    console.log("🔍 BestSelling: Product clicked with ID:", productId);
    console.log("🔍 Available products:", bestSellingProducts.map(p => ({ id: p.id, name: p.name })));
    
    const product = bestSellingProducts.find(
      (p) => parseInt(p.id) === productId,
    );
    
    console.log("🔍 Found product:", product ? product.name : "NOT FOUND");
    
    if (onProductClick && product) {
      console.log("🔍 Using parent onProductClick with ID:", product.id);
      onProductClick(product.id);
    } else if (product) {
      console.log("🔍 Navigating directly to /product/", product.id);
      // Navigate to product detail page using product ID
      navigate(`/product/${product.id}`);
    } else {
      console.error("🔍 Product not found for ID:", productId);
    }
  };

  const handleAddToCart = async (productId: number) => {
    console.log("🛒 BestSelling: Add to cart clicked for ID:", productId);
    
    const product = bestSellingProducts.find(
      (p) => parseInt(p.id) === productId,
    );
    
    console.log("🛒 Found product for cart:", product ? product.name : "NOT FOUND");
    
    if (!product) {
      console.error("🛒 Product not found for cart ID:", productId);
      return;
    }

    // If parent component has custom add to cart logic, use it
    if (onAddToCart) {
      console.log("🛒 Using parent onAddToCart");
      const primaryImage =
        product.images.find((img) => img.is_primary) || product.images[0];
      onAddToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        size: product.variants?.[0]?.size || "M",
        image: primaryImage?.image_url || "/placeholder.svg",
      });
      return;
    }

    // Otherwise, use database cart
    if (!user) {
      console.log("🛒 User not logged in, showing login toast");
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🛒 Adding to database cart...");
      // Get the first available variant or null if no variants
      const firstVariant = product.variants?.find(
        (v) => v.is_active && v.stock_quantity > 0,
      );
      
      console.log("🛒 Using variant:", firstVariant);

      await addToDbCart(product.id, firstVariant?.id || null, 1);

      const variantInfo = firstVariant
        ? ` (${firstVariant.size || "Standard"} - ${firstVariant.color_name || "Default"})`
        : "";

      toast({
        title: "Added to Cart!",
        description: `${product.name}${variantInfo} added to cart`,
      });
      
      console.log("🛒 Successfully added to cart");
    } catch (error) {
      console.error("🛒 Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Error adding to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleColorSelect = (productId: number, colorIndex: number) => {
    console.log("Color selected:", productId, colorIndex);
    const product = products.find((p) => p.id === productId);
    if (product && product.colors[colorIndex]) {
      console.log(
        `Selected ${product.colors[colorIndex].name} for ${product.name}`,
      );
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#111] text-[36px] md:text-[45px] font-normal leading-[58.5px] mb-4">
              Best Selling
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#111] text-[36px] md:text-[45px] font-normal leading-[58.5px] mb-4">
              Best Selling
            </h2>
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 text-lg mb-2">
                No best selling products found.
              </p>
              <p className="text-gray-500 text-sm">
                Admin can mark products as "Hot Sale" in the dashboard to display them here.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8">
      <div className="max-w-[1920px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-[#111] text-[45px] font-normal leading-[58.5px] mb-1">
            Best Selling Products
          </h2>
          <p className="text-[#555] text-[14px] font-normal leading-[26.25px]">
            Discover our most popular garments for men and women with all size
            and color options available.
          </p>
        </div>

        {/* Products Grid */}
        <div className="max-w-[1890px] mx-auto">
          <ProductRow
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onColorSelect={handleColorSelect}
          />
        </div>
      </div>
    </section>
  );
}
