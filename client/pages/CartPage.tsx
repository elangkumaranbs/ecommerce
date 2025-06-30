import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useIsMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Heart, 
  Tag, 
  Truck, 
  Shield, 
  ArrowLeft,
  Gift,
  Percent
} from 'lucide-react'

const CartPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, loading, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart()
  const { products } = useProducts()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  // State for features
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; discount: number } | null>(null)
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  // Constants
  const FREE_SHIPPING_THRESHOLD = 999
  const TAX_RATE = 0.18 // 18% GST
  const SHIPPING_COST = 99

  // Calculations
  const subtotal = getCartTotal()
  const discount = appliedDiscount ? (subtotal * appliedDiscount.discount) / 100 : 0
  const discountedSubtotal = subtotal - discount
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = Math.round((discountedSubtotal + shipping) * TAX_RATE)
  const total = discountedSubtotal + shipping + tax
  const freeShippingProgress = Math.min((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - discountedSubtotal, 0)

  // Mock discount codes
  const DISCOUNT_CODES = {
    'WELCOME10': 10,
    'SAVE15': 15,
    'FIRST20': 20,
    'FESTIVE25': 25
  }

  // Get recommended products (excluding cart items)
  const cartProductIds = cartItems.map(item => item.product_id)
  const recommendedProducts = products
    .filter(product => !cartProductIds.includes(product.id))
    .slice(0, 4)

  useEffect(() => {
    // Don't redirect to login just for viewing cart
    // Authentication will be required for checkout process
  }, [user, navigate])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity)
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (itemId: string, productName: string) => {
    try {
      await removeFromCart(itemId)
      toast({
        title: "Item removed",
        description: `${productName} has been removed from your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveForLater = (itemId: string, productName: string) => {
    setSavedItems(prev => [...prev, itemId])
    toast({
      title: "Saved for later",
      description: `${productName} has been saved for later.`,
    })
  }

  const handleApplyDiscount = async () => {
    setIsApplyingDiscount(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const code = discountCode.toUpperCase()
    const discount = DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES]
    
    if (discount) {
      setAppliedDiscount({ code, discount })
      toast({
        title: "Discount applied!",
        description: `${discount}% discount has been applied to your order.`,
      })
    } else {
      toast({
        title: "Invalid code",
        description: "The discount code you entered is not valid.",
        variant: "destructive",
      })
    }
    
    setIsApplyingDiscount(false)
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    toast({
      title: "Discount removed",
      description: "The discount code has been removed from your order.",
    })
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-32 mb-6" />
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-20 w-20 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            {!user ? (
              <>
                <p className="text-gray-600 mb-4">Please log in to see your saved cart items.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/login', { state: { from: '/cart' } })}
                  >
                    Log In
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/all-products">
                      Browse Products
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                <Button asChild size="lg">
                  <Link to="/all-products">
                    Start Shopping
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Show recommended products */}
          {recommendedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">You might like these</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={product.images?.[0]?.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                      <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                      <Button asChild className="w-full mt-3" size="sm">
                        <Link to={`/products/${product.slug}`}>
                          View Product
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">{getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in your cart</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {amountForFreeShipping > 0 && (
              <Alert>
                <Truck className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <span>Add ₹{amountForFreeShipping} more for free shipping!</span>
                    <span className="text-sm font-medium">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <Progress value={freeShippingProgress} className="h-2" />
                </AlertDescription>
              </Alert>
            )}

            {cartItems.map((item) => (
              <Card key={item.id} className="group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product.images?.[0]?.image_url || '/placeholder.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            <Link 
                              to={`/products/${item.product.slug}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
                          
                          {/* Variant Info */}
                          {item.variant && (
                            <div className="flex items-center space-x-3 mb-2">
                              {item.variant.color_name && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-600">Color:</span>
                                  <div className="flex items-center space-x-1">
                                    {item.variant.color_code && (
                                      <div 
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: item.variant.color_code }}
                                      />
                                    )}
                                    <span className="text-sm font-medium">{item.variant.color_name}</span>
                                  </div>
                                </div>
                              )}
                              {item.variant.size && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-600">Size:</span>
                                  <Badge variant="outline">{item.variant.size}</Badge>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Price */}
                          <p className="text-lg font-semibold text-gray-900">₹{item.product.price}</p>

                          {/* Stock Status */}
                          {item.variant && item.variant.stock_quantity < 5 && (
                            <p className="text-sm text-orange-600 mt-1">
                              Only {item.variant.stock_quantity} left in stock
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveForLater(item.id, item.product.name)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.variant ? item.quantity >= item.variant.stock_quantity : false}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Saved for Later ({savedItems.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Items you've saved for later will appear here.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Discount Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Discount Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {appliedDiscount.code} ({appliedDiscount.discount}% off)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveDiscount}
                      className="text-green-600 hover:text-green-700"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={!discountCode || isApplyingDiscount}
                        className="px-6"
                      >
                        {isApplyingDiscount ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Try: WELCOME10, SAVE15, FIRST20, FESTIVE25
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getCartItemCount()} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedDiscount.discount}%)</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Truck className="h-4 w-4" />
                    <span>Shipping</span>
                  </span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      navigate('/login', { state: { from: '/checkout' } })
                    } else {
                      navigate('/checkout')
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-4">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Shopping Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free shipping on orders above ₹999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>7-day easy returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-purple-600" />
                  <span>Best price guarantee</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/all-products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.images?.[0]?.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                    <Button asChild className="w-full mt-3" size="sm">
                      <Link to={`/products/${product.slug}`}>
                        View Product
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
