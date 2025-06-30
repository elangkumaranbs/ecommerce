import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, ArrowLeft, Share2, Truck, RotateCcw, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import type { Product } from '../hooks/useProducts';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Enhanced toggle states for sections
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    specifications: false,
    reviews: false,
    shipping: false,
    returns: false
  });

  // Toggle section visibility
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate product specifications based on product data
  const getProductSpecifications = (product: Product) => {
    const specs = [];
    
    if (product.category?.name) {
      specs.push({ label: 'Category', value: product.category.name });
    }
    
    if (product.subcategory) {
      specs.push({ label: 'Subcategory', value: product.subcategory });
    }
    
    if (product.sku) {
      specs.push({ label: 'SKU', value: product.sku });
    }
    
    // Get available sizes from variants
    const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];
    if (sizes.length > 0) {
      specs.push({ label: 'Available Sizes', value: sizes.join(', ') });
    }
    
    // Get available colors from variants
    const colors = [...new Set(product.variants?.map(v => v.color_name).filter(Boolean))];
    if (colors.length > 0) {
      specs.push({ label: 'Available Colors', value: colors.join(', ') });
    }
    
    // Add material info based on category/subcategory
    if (product.subcategory?.toLowerCase().includes('cotton')) {
      specs.push({ label: 'Material', value: 'Cotton Blend' });
    } else if (product.subcategory?.toLowerCase().includes('lycra')) {
      specs.push({ label: 'Material', value: 'Lycra Cotton' });
    } else if (product.subcategory?.toLowerCase().includes('polyester')) {
      specs.push({ label: 'Material', value: 'Polyester' });
    } else {
      specs.push({ label: 'Material', value: 'Premium Quality Fabric' });
    }
    
    specs.push({ label: 'Care Instructions', value: 'Machine wash cold, tumble dry low' });
    specs.push({ label: 'Country of Origin', value: 'India' });
    
    return specs;
  };

  // Mock reviews data - this could come from database in real implementation
  const getProductReviews = (product: Product) => {
    const reviewCount = product.review_count || 0;
    const rating = product.rating || 0;
    
    // Generate some sample reviews based on product rating
    const sampleReviews = [
      {
        id: 1,
        user: 'Priya S.',
        rating: 5,
        comment: 'Excellent quality! The fabric is soft and comfortable. Highly recommended.',
        date: '2024-12-15',
        verified: true
      },
      {
        id: 2,
        user: 'Rajesh K.',
        rating: 4,
        comment: 'Good product overall. Fast delivery and nice packaging.',
        date: '2024-12-10',
        verified: true
      },
      {
        id: 3,
        user: 'Sneha M.',
        rating: 5,
        comment: 'Perfect fit and great value for money. Will order again!',
        date: '2024-12-08',
        verified: false
      }
    ];
    
    return {
      totalReviews: reviewCount,
      averageRating: rating,
      reviews: sampleReviews.slice(0, Math.min(3, reviewCount))
    };
  };

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      if (foundProduct) {
        // Set default variant selections
        const firstVariant = foundProduct.variants?.[0];
        if (firstVariant) {
          setSelectedSize(firstVariant.size || '');
          setSelectedColor(firstVariant.color_name || '');
        }
      }
    }
  }, [products, id]);

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }

    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + change)));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700">
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images || [];
  const primaryImage = productImages.find(img => img.is_primary) || productImages[0];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800">
              Home
            </button>
            <span>/</span>
            <span className="text-blue-600 hover:text-blue-800">
              {product.category?.name || 'Products'}
            </span>
            {product.subcategory && (
              <>
                <span>/</span>
                <span className="text-blue-600 hover:text-blue-800">
                  {product.subcategory}
                </span>
              </>
            )}
            <span>/</span>
            <span className="text-gray-500">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={primaryImage?.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating || 4.5)}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating || 4.5}) • 127 reviews
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{(product.price || 0).toLocaleString()}
              </div>
            </div>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {/* Size Selection */}
                {product.variants.some(v => v.size) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map((size) => (
                          <SelectItem key={size} value={size!}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Color Selection */}
                {product.variants.some(v => v.color_name) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {[...new Set(product.variants.map(v => ({ name: v.color_name, code: v.color_code })).filter(c => c.name))].map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color.name!)}
                          className={`w-8 h-8 rounded-full border-2 transition-colors ${
                            selectedColor === color.name ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.code || '#000000' }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" className="p-3">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-gray-600">On orders over ₹999</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-gray-600">30-day return policy</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-gray-600">100% secure checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Product Information Sections */}
        <div className="mt-16 space-y-6">
          {/* Product Description */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('description')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
              {expandedSections.description ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSections.description && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.description || 'Experience premium quality and comfort with this carefully crafted product. Made with attention to detail and designed for modern lifestyle.'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Premium quality material</li>
                        <li>Comfortable fit and feel</li>
                        <li>Durable construction</li>
                        <li>Easy care instructions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>All-day comfort</li>
                        <li>Long-lasting quality</li>
                        <li>Versatile styling</li>
                        <li>Value for money</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Specifications */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('specifications')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Product Specifications</h3>
              {expandedSections.specifications ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSections.specifications && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getProductSpecifications(product).map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{spec.label}:</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('reviews')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews ({getProductReviews(product).totalReviews})
              </h3>
              {expandedSections.reviews ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSections.reviews && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {getProductReviews(product).averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center">{renderStars(getProductReviews(product).averageRating)}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {getProductReviews(product).totalReviews} reviews
                      </div>
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" className="w-full md:w-auto">
                        Write a Review
                      </Button>
                    </div>
                  </div>
                  
                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {getProductReviews(product).reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="font-medium text-gray-900">{review.user}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                          )}
                          <span className="text-sm text-gray-500 ml-auto">{review.date}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  {getProductReviews(product).totalReviews > 3 && (
                    <Button variant="outline" className="w-full">
                      View All Reviews
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('shipping')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
              {expandedSections.shipping ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSections.shipping && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Delivery Options
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Free shipping on orders over ₹999
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Standard delivery: 3-5 business days
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Express delivery: 1-2 business days
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Cash on delivery available
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Delivery Areas</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• All major cities in India</li>
                      <li>• Pin code serviceability check at checkout</li>
                      <li>• Remote areas may take 1-2 extra days</li>
                      <li>• International shipping available</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Exchange */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('returns')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Returns & Exchange</h3>
              {expandedSections.returns ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>
            {expandedSections.returns && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Return Policy
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        30-day return window
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Items must be unused with tags
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Free returns on defective items
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Easy return pickup service
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Refund Process</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Refund processed within 5-7 business days</li>
                      <li>• Original payment method credited</li>
                      <li>• Instant refund for wallet payments</li>
                      <li>• Exchange available for size/color</li>
                    </ul>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Need help?</strong> Contact our customer support for assistance with returns or exchanges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
