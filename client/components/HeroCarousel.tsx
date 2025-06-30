import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'

interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  image: string
  buttonText?: string
  buttonLink?: string
  textColor?: 'white' | 'dark'
  textPosition?: 'left' | 'center' | 'right'
}

const heroSlides: HeroSlide[] = [
  {
    id: 'comforter-festival',
    title: '',
    subtitle: '',
    image: '/comforter-festival-banner.webp',
    buttonText: '',
    buttonLink: '/category/leggings',
    textColor: 'white',
    textPosition: 'left'
  }
]

const HeroCarousel: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-500 font-medium">Loading amazing content...</div>
          </div>
        </div>
        {/* Skeleton elements */}
        <div className="absolute bottom-20 left-8 space-y-3">
          <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[100vh] md:h-[100vh] lg:h-[105vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.hero-button-next',
          prevEl: '.hero-button-prev',
          hideOnClick: false,
        }}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
          bulletClass: 'hero-pagination-bullet',
          bulletActiveClass: 'hero-pagination-bullet-active',
          renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
          },
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        speed={800}
        effect="slide"
        className="w-full h-full hero-swiper"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Full-size Image */}
              <img
                src={slide.image}
                alt={slide.title || 'Banner image'}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Content */}
              <div className="relative z-10 flex items-center h-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div 
                    className={`max-w-2xl ${
                      slide.textPosition === 'center' 
                        ? 'mx-auto text-center' 
                        : slide.textPosition === 'right'
                        ? 'ml-auto text-right'
                        : 'text-left'
                    }`}
                  >
                    {slide.title && (
                      <h1 
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 leading-tight ${
                          slide.textColor === 'dark' 
                            ? 'text-gray-900' 
                            : 'text-white drop-shadow-lg'
                        }`}
                      >
                        {slide.title}
                      </h1>
                    )}
                    
                    {slide.subtitle && (
                      <p 
                        className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-8 leading-relaxed ${
                          slide.textColor === 'dark' 
                            ? 'text-gray-700' 
                            : 'text-white text-opacity-90 drop-shadow-md'
                        }`}
                      >
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.buttonText && slide.buttonLink && (
                      <Button
                        asChild
                        size="lg"
                        className={`
                          px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full
                          transition-all duration-300 transform hover:scale-105
                          ${slide.textColor === 'dark' 
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'bg-white text-gray-900 hover:bg-gray-100'
                          }
                          shadow-lg hover:shadow-xl
                        `}
                      >
                        <a href={slide.buttonLink}>
                          {slide.buttonText}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="hero-button-prev absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 shadow-lg">
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button className="hero-button-next absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 shadow-lg">
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Custom Pagination */}
      <div className="hero-pagination absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
        {/* Pagination bullets will be rendered here by Swiper */}
      </div>

      {/* Global styles for pagination bullets */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hero-pagination-bullet {
            width: 12px !important;
            height: 12px !important;
            background: rgba(255, 255, 255, 0.5) !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
          }
          
          .hero-pagination-bullet-active {
            background: white !important;
            transform: scale(1.2) !important;
          }
          
          .hero-pagination-bullet:hover {
            background: rgba(255, 255, 255, 0.8) !important;
            transform: scale(1.1) !important;
          }
        `
      }} />
    </div>
  )
}

export default HeroCarousel
