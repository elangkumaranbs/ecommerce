import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'

interface CategoryColumn {
  id: string
  title: string
  subtitle?: string
  image: string
  link: string
  textColor?: 'white' | 'dark'
  textPosition?: 'top' | 'center' | 'bottom'
  buttonStyle?: 'primary' | 'secondary' | 'outline'
}

const categoryColumns: CategoryColumn[] = [
  {
    id: 'mens',
    title: "Men's Collection",
    subtitle: 'Stylish T-shirts & Comfortable Wear',
    image: '/mens-batman-tshirt.jpg',
    link: '/category/mens',
    textColor: 'white',
    textPosition: 'bottom',
    buttonStyle: 'primary'
  },
  {
    id: 'womens',
    title: "Women's Collection",
    subtitle: 'Premium Leggings & Activewear',
    image: '/womens-collection-new.webp',
    link: '/category/womens',
    textColor: 'white',
    textPosition: 'bottom',
    buttonStyle: 'primary'
  },
  {
    id: 'sale',
    title: 'Hot Sale',
    subtitle: 'Up to 70% Off',
    image: '/hot-sale-new.webp',
    link: '/hot-sales',
    textColor: 'white',
    textPosition: 'bottom',
    buttonStyle: 'secondary'
  }
]

const FullWidthCategorySection: React.FC = () => {
  return (
    <div className="w-full">
      {/* Main Category Grid - Full Height */}
      <div className="grid grid-cols-1 md:grid-cols-3 h-screen md:h-[100vh] lg:h-[110vh]">
        {categoryColumns.map((category, index) => (
          <div 
            key={category.id}
            className="relative group overflow-hidden cursor-pointer"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ 
                backgroundImage: `url(${category.image})`,
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Content Overlay */}
            <div className={`
              absolute inset-0 flex items-end p-8 md:p-12 lg:p-16 z-10
              ${category.textPosition === 'top' ? 'items-start' : 
                category.textPosition === 'center' ? 'items-center' : 'items-end'}
            `}>
              <div className="w-full text-left">
                {/* Category Title */}
                <h3 className={`
                  text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 lg:mb-6 leading-tight
                  ${category.textColor === 'dark' ? 'text-gray-900' : 'text-white'}
                  transform transition-transform duration-300 group-hover:translate-y-[-4px]
                `}>
                  {category.title}
                </h3>
                
                {/* Subtitle */}
                {category.subtitle && (
                  <p className={`
                    text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 md:mb-8 lg:mb-10 leading-relaxed
                    ${category.textColor === 'dark' ? 'text-gray-700' : 'text-white/90'}
                    transform transition-transform duration-300 group-hover:translate-y-[-2px]
                  `}>
                    {category.subtitle}
                  </p>
                )}

                {/* Shop Now Button */}
                <Link to={category.link}>
                  <Button
                    size="lg"
                    className={`
                      group/btn relative overflow-hidden rounded-full font-semibold
                      px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl
                      transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                      ${category.buttonStyle === 'primary' 
                        ? 'bg-white text-gray-900 hover:bg-gray-100' 
                        : category.buttonStyle === 'secondary'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="relative z-10 flex items-center space-x-3">
                      <span>Shop Now</span>
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                    
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Category Index Number */}
            <div className="absolute top-8 right-8 md:top-10 md:right-10 lg:top-12 lg:right-12 z-10">
              <div className={`
                w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-base md:text-lg lg:text-xl font-bold
                ${category.textColor === 'dark' ? 'bg-gray-900 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}
                transform transition-all duration-300 group-hover:scale-110
              `}>
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FullWidthCategorySection
