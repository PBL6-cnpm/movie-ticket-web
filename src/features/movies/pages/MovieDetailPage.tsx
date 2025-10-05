import { Link, useParams } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, Play, Star, Ticket, User, Users, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import { useMovieDetail, useSimilarMovies } from '../hooks/useMovieDetail'

interface SimilarMovie {
    id: string
    name: string
    poster: string
}

const MovieDetailPage: React.FC = () => {
    const { movieId } = useParams({ from: '/movie/$movieId' })
    const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetail(movieId)
    const [showTrailer, setShowTrailer] = useState(false)
    const genres = movie?.genres.map((g: { id: string; name: string }) => g.name) || []
    const { data: similarMovies, isLoading: similarLoading } = useSimilarMovies(genres, movieId)

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

    const getAgeColor = (ageLimit: number) => {
        if (ageLimit >= 18) return 'from-red-500 to-red-600'
        if (ageLimit >= 16) return 'from-yellow-500 to-yellow-600'
        if (ageLimit >= 13) return 'from-orange-500 to-orange-600'
        return 'from-green-500 to-green-600'
    }

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showTrailer) {
                setShowTrailer(false)
            }
        }

        if (showTrailer) {
            document.addEventListener('keydown', handleEscKey)
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
            document.body.style.top = `-${window.scrollY}px`
        } else {
            const scrollY = document.body.style.top
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey)
            document.body.style.overflow = 'unset'
        }
    }, [showTrailer])

    if (movieLoading)
        return (
            <PageTransition>
                <div className="min-h-screen bg-brand flex items-center justify-center text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading amazing content...</p>
                    </div>
                </div>
            </PageTransition>
        )

    if (movieError || (!movieLoading && !movie))
        return (
            <PageTransition>
                <div className="min-h-screen bg-brand flex items-center justify-center text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
                        <Link to="/" className="btn-primary mt-4 inline-block">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </PageTransition>
        )

    if (!movie) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-brand flex items-center justify-center text-white">
                    Loading...
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
                <div className="container-custom py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Movies', path: '/' },
                            { label: movie?.name || 'Movie Details', isActive: true }
                        ]}
                    />

                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        {/* Left Column - 75% */}
                        <div className="flex-1 lg:w-3/4 space-y-6">
                            {/* Hero Section with Backdrop */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1e2542] to-[#2a3154] border border-white/5">
                                <div className="flex flex-col md:flex-row gap-8 p-8">
                                    {/* Poster */}
                                    <div className="flex-shrink-0 mx-auto md:mx-0">
                                        <div className="relative group">
                                            <img
                                                src={movie.poster}
                                                alt={movie.name}
                                                className="w-64 md:w-72 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div
                                                className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-gradient-to-r ${getAgeColor(movie.ageLimit)} text-white text-sm font-bold shadow-lg`}
                                            >
                                                {movie.ageLimit}+
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-white">
                                        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {movie.name}
                                        </h1>

                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                <Calendar className="w-4 h-4 text-brand-primary" />
                                                <span className="text-sm">
                                                    {formatDate(movie.releaseDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                <Clock className="w-4 h-4 text-brand-primary" />
                                                <span className="text-sm">
                                                    {formatDuration(movie.duration)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm font-semibold">8.5</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {movie.genres.map(
                                                (genre: { id: string; name: string }) => (
                                                    <span
                                                        key={genre.id}
                                                        className="px-4 py-1.5 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 text-white rounded-full text-sm font-medium backdrop-blur-sm"
                                                    >
                                                        {genre.name}
                                                    </span>
                                                )
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                                            <p className="text-gray-300 leading-relaxed text-sm">
                                                {movie.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6">
                                            <User className="w-5 h-5 text-brand-primary" />
                                            <span className="text-sm text-gray-400">Director:</span>
                                            <span className="text-white font-semibold">
                                                {movie.director}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3">
                                            {movie.trailer && (
                                                <button
                                                    onClick={() => setShowTrailer(true)}
                                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105"
                                                >
                                                    <Play className="w-5 h-5" />
                                                    Watch Trailer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cast Section */}
                            <div className="bg-gradient-to-br from-[#1e2542] to-[#2a3154] rounded-3xl p-8 shadow-xl border border-white/5">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-brand-primary" />
                                    Cast & Crew
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {movie.actors.map(
                                        (actor: { id: string; name: string; picture: string }) => (
                                            <Link
                                                key={actor.id}
                                                to="/actor/$actorId"
                                                params={{ actorId: actor.id }}
                                                className="text-center block group"
                                            >
                                                <div className="relative mb-3">
                                                    <img
                                                        src={actor.picture || '/default-avatar.jpg'}
                                                        alt={actor.name}
                                                        className="w-20 h-20 rounded-full object-cover mx-auto shadow-lg group-hover:shadow-brand-primary/50 transition-all border-2 border-transparent group-hover:border-brand-primary"
                                                    />
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                                                    {actor.name}
                                                </p>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Booking Section */}
                            <div className="bg-gradient-to-br from-[#1e2542] to-[#2a3154] rounded-3xl p-8 shadow-xl border border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                                        <Ticket className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            Book Your Seats
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Select showtime and cinema
                                        </p>
                                    </div>
                                </div>

                                {/* Showtimes Grid */}
                                <div className="space-y-4">
                                    {/* Date Selector */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                                            Select Date
                                        </label>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {['Mon 6', 'Tue 7', 'Wed 8', 'Thu 9', 'Fri 10'].map(
                                                (date, idx) => (
                                                    <button
                                                        key={idx}
                                                        className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${
                                                            idx === 0
                                                                ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
                                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {date}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Cinema & Showtimes */}
                                    <div className="space-y-4">
                                        {['CGV Vincom', 'Lotte Cinema'].map((cinema, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                                            >
                                                <div className="flex items-center gap-2 mb-4">
                                                    <MapPin className="w-5 h-5 text-brand-primary" />
                                                    <h4 className="text-lg font-semibold text-white">
                                                        {cinema}
                                                    </h4>
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    {[
                                                        '09:00',
                                                        '11:30',
                                                        '14:00',
                                                        '16:30',
                                                        '19:00'
                                                    ].map((time, timeIdx) => (
                                                        <button
                                                            key={timeIdx}
                                                            className="px-6 py-2 bg-white/10 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-secondary text-white rounded-lg font-medium transition-all hover:scale-105"
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - 25% */}
                        <div className="hidden lg:block lg:w-1/4 space-y-6">
                            <div className="bg-gradient-to-br from-[#1e2542] to-[#2a3154] rounded-3xl p-6 shadow-xl border border-white/5 sticky top-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-brand-primary" />
                                    Now Showing
                                </h3>
                                <div className="space-y-4">
                                    {!similarLoading &&
                                        similarMovies &&
                                        similarMovies.slice(0, 5).map((similar: SimilarMovie) => (
                                            <Link
                                                key={similar.id}
                                                to="/movie/$movieId"
                                                params={{ movieId: similar.id }}
                                                className="group block"
                                            >
                                                <div className="flex gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-all border border-white/5 hover:border-brand-primary/50">
                                                    <div className="relative flex-shrink-0 w-20 rounded-lg overflow-hidden">
                                                        <img
                                                            src={similar.poster}
                                                            alt={similar.name}
                                                            className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                                        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-brand-primary transition-colors">
                                                            {similar.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                            <span>8.2</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trailer Modal - FIXED */}
                {showTrailer && (
                    <div
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md"
                        onClick={() => setShowTrailer(false)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh'
                        }}
                    >
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 z-[10000] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            style={{ position: 'fixed' }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div
                            className="relative w-full max-w-6xl bg-[#1a1f3a] rounded-2xl overflow-hidden shadow-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxHeight: '90vh' }}
                        >
                            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={
                                        movie.trailer.replace('watch?v=', 'embed/') +
                                        '?autoplay=1&rel=0&modestbranding=1'
                                    }
                                    title={`${movie.name} Trailer`}
                                    allowFullScreen
                                    allow="autoplay; encrypted-media"
                                    className="absolute top-0 left-0 w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}

export default MovieDetailPage
