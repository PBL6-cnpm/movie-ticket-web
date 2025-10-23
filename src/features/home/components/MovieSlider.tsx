import type { Movie } from '@/shared/data/mockMovies'
import { Link } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'
import MovieCard from './MovieCard'

interface MovieSliderProps {
    movies: Movie[]
    cardSize?: 'small' | 'medium' | 'large'
    viewAllUrl?: string
}

const MovieSlider: React.FC<MovieSliderProps> = ({ movies, cardSize = 'medium', viewAllUrl }) => {
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
            sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const handleScroll = () => checkScrollButtons()
        const slider = sliderRef.current
        slider?.addEventListener('scroll', handleScroll)

        checkScrollButtons()

        return () => {
            slider?.removeEventListener('scroll', handleScroll)
        }
    }, [movies])

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute -top-12 right-0 flex gap-2 z-10">
                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        canScrollLeft
                            ? 'bg-[#242b3d] border-[#fe7e32] hover:bg-[#fe7e32] text-[#fe7e32] hover:text-white shadow-lg hover:shadow-[#fe7e32]/30'
                            : 'bg-[#1a2232] border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                    aria-label="Scroll left"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        canScrollRight
                            ? 'bg-[#242b3d] border-[#648ddb] hover:bg-[#648ddb] text-[#648ddb] hover:text-white shadow-lg hover:shadow-[#648ddb]/30'
                            : 'bg-[#1a2232] border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                    aria-label="Scroll right"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Movies Slider */}
            <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {movies.map((movie) => (
                    <div key={movie.id} className="flex-shrink-0">
                        <MovieCard movie={movie} size={cardSize} />
                    </div>
                ))}
                {viewAllUrl && (
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <Link
                            to={viewAllUrl}
                            className="flex flex-col items-center justify-center w-48 h-full bg-[#242b3d] rounded-2xl text-white hover:bg-[#fe7e32] transition-all duration-300 group"
                        >
                            <svg
                                className="w-12 h-12 mb-2 text-[#fe7e32] group-hover:text-white transition-colors duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-semibold">View All</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Gradient Fade Effects */}
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#1a2232] to-transparent pointer-events-none z-10" />
            )}
            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1a2232] to-transparent pointer-events-none z-10" />
            )}
        </div>
    )
}

export default MovieSlider
