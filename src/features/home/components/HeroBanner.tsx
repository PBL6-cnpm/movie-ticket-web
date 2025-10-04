import React, { useEffect, useState } from 'react'

const desktopImages = [
    '/src/assets/banner/desktop/avatar-2-2480_1758269622108.jpg',
    '/src/assets/banner/desktop/imax-treasure-hunt--s4_1758703859745.jpg',
    '/src/assets/banner/desktop/tu-chien-tren-khong-2048_1757996321581.jpg'
]

const mobileImages = [
    '/src/assets/banner/mobile/avatar-2-750_1758269621660.jpg',
    '/src/assets/banner/mobile/imax-treasure-hunt-3_1758703877923.jpg',
    '/src/assets/banner/mobile/tu-chien-tren-khong-750_1757996322015.jpg'
]

const HeroBanner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const slideImages = isMobile ? mobileImages : desktopImages

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slideImages.length])

    const goToSlide = (index: number) => setCurrentIndex(index)

    // Responsive height and aspect ratio for mobile
    const bannerClass = isMobile
        ? 'relative w-full max-w-[430px] mx-auto aspect-[430/287] overflow-hidden rounded-xl shadow-2xl'
        : 'relative h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-2xl'

    return (
        <div className={bannerClass}>
            {/* Carousel Images */}
            {slideImages.map((imageUrl, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={imageUrl}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src =
                                'https://via.placeholder.com/430x287/1a2232/ffffff?text=Movie+Banner'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent rounded-xl" />
                </div>
            ))}

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
                {slideImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`rounded-full border border-brand-primary transition-all duration-200 focus:outline-none
                            ${
                                index === currentIndex
                                    ? 'bg-brand-primary shadow-md scale-105'
                                    : 'bg-white bg-opacity-60 hover:bg-brand-primary hover:bg-opacity-80'
                            }
                            w-2.5 h-2.5 sm:w-3 sm:h-3
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default HeroBanner
