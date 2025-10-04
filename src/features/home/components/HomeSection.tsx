'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import api from '@/lib/api'
import type { Movie as UIMovie } from '@/shared/data/mockMovies'
import type { ApiListResponse, Movie as ApiMovie } from '@/shared/types/movies.types'
import { useEffect, useState } from 'react'
import HeroBanner from './HeroBanner'
import MovieSlider from './MovieSlider'

const HomeSection = () => {
    const { isAuthenticated, user } = useAuth()
    const [movies, setMovies] = useState<UIMovie[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Auto redirect by role
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role?.roleName === 'admin') {
                window.location.href = '/admin'
            } else if (user.role?.roleName === 'employee') {
                window.location.href = '/employee'
            } else if (user.role?.roleName === 'user') {
                window.location.href = '/customer'
            }
        }
    }, [isAuthenticated, user])

    const mapApiMovieToUi = (m: ApiMovie): UIMovie => ({
        id: m.id,
        title: m.name,
        description: m.description,
        poster: m.poster,
        banner: m.poster,
        releaseDate: m.releaseDate,
        duration: m.duration,
        genres: m.genres.map((g) => g.name),
        rating: 0,
        status: new Date(m.releaseDate) <= new Date() ? 'now-showing' : 'coming-soon',
        trailer: m.trailer,
        cast: m.actors.map((a) => a.name),
        director: m.director,
        ageLimit: m.ageLimit,
        ageRating: `${m.ageLimit}+`
    })

    // Fetch movies
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await api.get<ApiListResponse<ApiMovie>>('/movies', {
                    params: { limit: 10, offset: 0 }
                })
                if (res.data && res.data.data?.items) {
                    const mapped = res.data.data.items.map(mapApiMovieToUi)
                    setMovies(mapped)
                } else {
                    setError('Không thể tải dữ liệu phim!')
                }
            } catch (err) {
                console.error('Movie fetch error:', err)
                setError('Không thể tải dữ liệu phim!')
            } finally {
                setLoading(false)
            }
        }
        fetchMovies()
    }, [])

    // Filter movies for different sliders based on available fields
    const nowShowingMovies = movies.filter((m) => m.status === 'now-showing')
    const comingSoonMovies = movies.filter((m) => m.status === 'coming-soon')
    const featuredMovies = movies.slice(0, 10)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-lg text-primary">Đang tải phim...</span>
            </div>
        )
    }
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-lg text-red-500">{error}</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand">
            {/* Hero Banner */}
            <div className="pt-8 pb-12 px-2 md:px-0">
                <HeroBanner />
            </div>

            {/* Movies Sections */}
            <div className="bg-surface rounded-t-3xl shadow-xl pt-10 pb-16">
                <div className="grid grid-cols-1 gap-y-12">
                    <MovieSlider title="Featured Movies" movies={featuredMovies} cardSize="large" />
                    <MovieSlider title="Now Showing" movies={nowShowingMovies} cardSize="medium" />
                    <MovieSlider
                        title="🔥 Coming Soon"
                        movies={comingSoonMovies}
                        cardSize="medium"
                    />
                </div>
            </div>
        </div>
    )
}

export default HomeSection
