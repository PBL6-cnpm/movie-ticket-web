'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { getRedirectPathByRole } from '@/features/auth/utils/role.util'
import { apiClient } from '@/shared/api/api-client'
import type { Movie as UIMovie } from '@/shared/data/mockMovies'
import type { ApiListResponse, Movie as ApiMovie } from '@/shared/types/movies.types'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import ContactSection from './ContactSection'
import HeroBanner from './HeroBanner'
import MobileAppBanner from './MobileAppBanner'
import MovieSlider from './MovieSlider'
import PromotionsSection from './PromotionsSection'
import QuickBooking from './QuickBooking'

const HomeSection = () => {
    const { account } = useAuth()
    const navigate = useNavigate()
    const [upcomingMovies, setUpcomingMovies] = useState<UIMovie[]>([])
    const [nowShowingMovies, setNowShowingMovies] = useState<UIMovie[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isQuickBookingSticky, setIsQuickBookingSticky] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)
    const quickBookingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchInitialMovies = async () => {
            try {
                setLoading(true)
                setError(null)

                const [upcomingResponse, nowShowingResponse] = await Promise.all([
                    apiClient.get<ApiListResponse<ApiMovie>>(
                        '/movies/upcoming?limit=10&offset=0'
                    ),
                    apiClient.get<ApiListResponse<ApiMovie>>(
                        '/movies/now-showing?limit=10&offset=0'
                    )
                ])

                const movieMapper = (movie: ApiMovie): UIMovie => ({
                    id: movie.id,
                    title: movie.name,
                    poster: movie.poster,
                    duration: movie.duration,
                    releaseDate: movie.releaseDate,
                    ageRating: `T${movie.ageLimit}`,
                    rating: 8.5, // Placeholder rating
                    genres: movie?.genres?.map((g) => g.name) ?? [],
                    description: movie.description || '',
                    actors: movie.actors?.map((actor) => actor.name) ?? [],
                    director: movie.director || '',
                    status: movie.status ?? 'unknown'
                })

                if (upcomingResponse.data.success && upcomingResponse.data.data?.items) {
                    setUpcomingMovies(upcomingResponse.data.data.items.map(movieMapper))
                }

                if (nowShowingResponse.data.success && nowShowingResponse.data.data?.items) {
                    setNowShowingMovies(nowShowingResponse.data.data.items.map(movieMapper))
                }
            } catch (err) {
                console.error('Error fetching movies:', err)
                setError('Unable to load movies. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchInitialMovies()
    }, [])

    useEffect(() => {
        if (account) {
            const redirectPath = getRedirectPathByRole(account)
            if (redirectPath !== '/') {
                navigate({ to: redirectPath })
            }
        }
    }, [account, navigate])

    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current && quickBookingRef.current) {
                const heroBottom = heroRef.current.getBoundingClientRect().bottom
                const shouldStick = heroBottom < 80
                setIsQuickBookingSticky(shouldStick)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a2232]">
                {/* Skeletons */}
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center">
                {/* Error UI */}
            </div>
        )
    }

    const quickBookingMovies = [...upcomingMovies, ...nowShowingMovies].map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        duration: movie.duration,
        ageRating: movie.ageRating || 'T18'
    }))

    return (
        <div className="min-h-screen bg-[#1a2232]">
            {/* Hero Banner */}
            <div ref={heroRef} className="relative">
                <div className="animate-in fade-in slide-in-from-top duration-700">
                    <HeroBanner />
                </div>
            </div>

            {/* Quick Booking Bar */}
            <div ref={quickBookingRef} className="relative z-30">
                <div
                    className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom duration-700`}
                    style={{ animationDelay: '200ms' }}
                >
                    <QuickBooking movies={quickBookingMovies} />
                </div>
            </div>

            {/* Movie Sections */}
            <div className="py-16 lg:py-20">
                <div className="container-custom space-y-16 lg:space-y-20">
                    {/* Upcoming Movies */}
                    {upcomingMovies.length > 0 && (
                        <div
                            className="animate-in fade-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: '300ms' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-gradient-to-b from-[#fe7e32] to-[#648ddb] rounded-full"></div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                        Upcoming Movies
                                    </h2>
                                </div>
                            </div>
                            <MovieSlider
                                movies={upcomingMovies}
                                viewAllUrl="/movies/upcoming"
                            />
                        </div>
                    )}

                    {/* Now Showing */}
                    {nowShowingMovies.length > 0 && (
                        <div
                            className="animate-in fade-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: '400ms' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-gradient-to-b from-[#fe7e32] to-[#648ddb] rounded-full"></div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                        Now Showing
                                    </h2>
                                </div>
                            </div>
                            <MovieSlider
                                movies={nowShowingMovies}
                                viewAllUrl="/movies/now-showing"
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {upcomingMovies.length === 0 && nowShowingMovies.length === 0 && (
                        <div className="text-center py-20">{/* Empty State UI */}</div>
                    )}
                </div>
            </div>

            {/* New Sections */}
            <PromotionsSection />
            <MobileAppBanner />
            <ContactSection />

            {/* Back to top button */}
            {isQuickBookingSticky && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#fe7e32] to-[#648ddb] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
                    aria-label="Back to top"
                >
                    <svg
                        className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default HomeSection
