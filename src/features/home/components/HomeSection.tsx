'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { getRedirectPathByRole } from '@/features/auth/utils/role.util'
import { apiClient } from '@/shared/api/api-client'
import type { Movie as UIMovie } from '@/shared/data/mockMovies'
import type { ApiListResponse, Movie as ApiMovie } from '@/shared/types/movies.types'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import HeroBanner from './HeroBanner'
import MovieSlider from './MovieSlider'
import QuickBooking from './QuickBooking'

const HomeSection = () => {
    const { account } = useAuth()
    const navigate = useNavigate()
    const [featuredMovies, setFeaturedMovies] = useState<UIMovie[]>([])
    const [nowShowingMovies, setNowShowingMovies] = useState<UIMovie[]>([])
    const [comingSoonMovies, setComingSoonMovies] = useState<UIMovie[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isQuickBookingSticky, setIsQuickBookingSticky] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)
    const quickBookingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await apiClient.get<ApiListResponse<ApiMovie>>('/movies?limit=10')

                if (response.data.success && response.data.data?.items) {
                    const movies = response.data.data.items.map(
                        (movie: ApiMovie): UIMovie => ({
                            id: movie.id,
                            title: movie.name,
                            poster: movie.poster,
                            duration: movie.duration,
                            releaseDate: movie.releaseDate,
                            ageRating: `T${movie.ageLimit}`,
                            rating: 8.5,
                            genres: movie?.genres?.map((g) => g.name) ?? [],
                            description: movie.description || '',
                            actors: movie.actors?.map((actor) => actor.name) ?? [],
                            director: movie.director || '',
                            status: movie.status ?? 'unknown'
                        })
                    )

                    const featured = movies.filter((movie) => movie.rating >= 8.0).slice(0, 10)
                    const nowShowing = movies
                        .filter((movie) => {
                            const releaseDate = new Date(movie.releaseDate)
                            const today = new Date()
                            return releaseDate <= today
                        })
                        .slice(0, 10)
                    const comingSoon = movies
                        .filter((movie) => {
                            const releaseDate = new Date(movie.releaseDate)
                            const today = new Date()
                            return releaseDate > today
                        })
                        .slice(0, 10)

                    setFeaturedMovies(featured)
                    setNowShowingMovies(nowShowing)
                    setComingSoonMovies(comingSoon)
                }
            } catch (err) {
                console.error('Error fetching movies:', err)
                setError('Unable to load movies. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
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
                {/* Hero Skeleton */}
                <div className="relative h-[500px] lg:h-[600px] bg-gradient-to-b from-gray-800 to-[#1a2232] animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-64 h-8 bg-gray-700 rounded-lg mx-auto"></div>
                            <div className="w-48 h-6 bg-gray-700 rounded-lg mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Quick Booking Skeleton */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                    <div className="bg-[#242b3d] rounded-2xl p-6 lg:p-8 animate-pulse border border-gray-700/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="w-20 h-4 bg-gray-700 rounded"></div>
                                    <div className="w-full h-10 bg-gray-700 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Movie Sections Skeleton */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-48 h-8 bg-gray-800 rounded-lg animate-pulse"></div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {[...Array(5)].map((_, j) => (
                                    <div
                                        key={j}
                                        className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-[#cccccc]">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-[#fe7e32] to-[#648ddb] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const quickBookingMovies = [...featuredMovies, ...nowShowingMovies].map((movie) => ({
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

            {/* Quick Booking Bar - Full Width Container */}
            <div
                ref={quickBookingRef}
                className="relative z-30 transition-all duration-300 
                "
            >
                <div className="">
                    <div
                        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom duration-700`}
                        style={{ animationDelay: '200ms' }}
                    >
                        <QuickBooking movies={quickBookingMovies} />
                    </div>
                </div>
            </div>

            {/* Movie Sections */}
            <div className="py-16 lg:py-20">
                <div className="max-w-8xl mx-18  px-12 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
                    {/* Featured Movies */}
                    {featuredMovies.length > 0 && (
                        <div
                            className="animate-in fade-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: '300ms' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-[#fe7e32] to-[#648ddb] rounded-full"></div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                    Featured Movies
                                </h2>
                            </div>
                            <MovieSlider movies={featuredMovies} />
                        </div>
                    )}

                    {/* Now Showing */}
                    {nowShowingMovies.length > 0 && (
                        <div
                            className="animate-in fade-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: '400ms' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-[#fe7e32] to-[#648ddb] rounded-full"></div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                    Now Showing
                                </h2>
                            </div>
                            <MovieSlider movies={nowShowingMovies} />
                        </div>
                    )}

                    {/* Coming Soon */}
                    {comingSoonMovies.length > 0 && (
                        <div
                            className="animate-in fade-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: '500ms' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-[#fe7e32] to-[#648ddb] rounded-full"></div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                    Coming Soon
                                </h2>
                            </div>
                            <MovieSlider movies={comingSoonMovies} />
                        </div>
                    )}

                    {/* Empty State */}
                    {featuredMovies.length === 0 &&
                        nowShowingMovies.length === 0 &&
                        comingSoonMovies.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-[#242b3d] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-12 h-12 text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    No Movies Available
                                </h3>
                                <p className="text-[#cccccc]">
                                    There are no movies currently showing. Please check back later.
                                </p>
                            </div>
                        )}
                </div>
            </div>

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
