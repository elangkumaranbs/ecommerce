import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Tag, Users, Zap } from 'lucide-react'

interface CollectionItem {
  id: string
  title: string
  description: string
  image: string
  link: string
  badge?: string
  icon?: React.ReactNode
  gradient: string
}

const collections: CollectionItem[] = [
  {
    id: 'mens',
    title: "Men's Collection",
    description: 'Stylish T-shirts and comfortable wear for men',
    image: '/mens-batman-tshirt.jpg',
    link: '/category/mens',
    icon: <Users className="w-5 h-5" />,
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    id: 'womens',
    title: "Women's Collection",
    description: 'Premium leggings and activewear for women',
    image: '/womens-collection-new.webp',
    link: '/category/womens',
    icon: <Users className="w-5 h-5" />,
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'sale',
    title: 'Hot Sale',
    description: 'Up to 70% off on selected items',
    image: '/hot-sale-new.webp',
    link: '/hot-sales',
    badge: 'UP TO 70% OFF',
    icon: <Zap className="w-5 h-5" />,
    gradient: 'from-red-500 to-orange-600'
  }
]

const CollectionGrid: React.FC = () => {
  return (
    <div className="w-full py-8 lg:py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections designed for every style and occasion
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {collections.map((collection) => (
            <Card 
              key={collection.id} 
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
            >
              <CardContent className="p-0">
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${collection.image})`,
                    }}
                  />
                  
                  {/* Badge Only */}
                  {collection.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse">
                        <Tag className="w-3 h-3" />
                        <span>{collection.badge}</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-3">
            Can't find what you're looking for?
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-6 py-2 rounded-full transition-all duration-300"
          >
            <Link to="/all-products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CollectionGrid
