import type { Movie } from '@/shared/data/mockMovies'
import React, { useRef, useState } from 'react'
import MovieCard from './MovieCard'

interface MovieSliderProps {
    title: string
    movies: Movie[]
    cardSize?: 'small' | 'medium' | 'large'
}

const MovieSlider: React.FC<MovieSliderProps> = ({ title, movies, cardSize = 'medium' }) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)

    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScrollButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' })
            setTimeout(checkScrollButtons, 300)
        }
    }

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' })
            setTimeout(checkScrollButtons, 300)
        }
    }

    return (
        <section className="py-10">
            <div className="container-custom">
                {/* Section Header - modern style */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight whitespace-nowrap drop-shadow-lg">
                        {title}
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={scrollLeft}
                            disabled={!canScrollLeft}
                            className={`p-3 rounded-full border-2 transition-all duration-200 shadow-md ${
                                canScrollLeft
                                    ? 'bg-surface border-brand-primary hover:bg-brand-primary hover:text-white text-brand-primary'
                                    : 'bg-brand border-surface text-secondary cursor-not-allowed opacity-50'
                            }`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={scrollRight}
                            disabled={!canScrollRight}
                            className={`p-3 rounded-full border-2 transition-all duration-200 shadow-md ${
                                canScrollRight
                                    ? 'bg-surface border-brand-primary hover:bg-brand-primary hover:text-white text-brand-primary'
                                    : 'bg-brand border-surface text-secondary cursor-not-allowed opacity-50'
                            }`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Movies Slider */}
                <div className="relative">
                    <div
                        ref={sliderRef}
                        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onScroll={checkScrollButtons}
                    >
                        {movies.map((movie) => (
                            <div key={movie.id} className="flex-shrink-0">
                                <MovieCard movie={movie} size={cardSize} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MovieSlider
