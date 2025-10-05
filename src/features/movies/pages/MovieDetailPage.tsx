import { Link, useParams } from '@tanstack/react-router'
import { Calendar, Clock, Play, User, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import SimilarMoviesSection from '../components/SimilarMoviesSection'
import { useMovieDetail, useSimilarMovies } from '../hooks/useMovieDetail'

const MovieDetailPage: React.FC = () => {
    const { movieId } = useParams({ from: '/movie/$movieId' })
    const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetail(movieId)
    const [showTrailer, setShowTrailer] = useState(false)
    const genres = movie?.genres.map((g: { id: string; name: string }) => g.name) || []
    const { data: similarMovies, isLoading: similarLoading } = useSimilarMovies(genres, movieId)

    // Debug logging
    console.log('MovieDetailPage Debug:', {
        movieId,
        movie,
        movieLoading,
        movieError: movieError?.message || movieError
    })

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
        if (ageLimit >= 18) return 'bg-red-500 border-red-500'
        if (ageLimit >= 16) return 'bg-yellow-500 border-yellow-500'
        if (ageLimit >= 13) return 'bg-orange-500 border-orange-500'
        return 'bg-green-500 border-green-500'
    }

    // Handle ESC key to close trailer modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showTrailer) {
                setShowTrailer(false)
            }
        }

        if (showTrailer) {
            document.addEventListener('keydown', handleEscKey)
            document.body.style.overflow = 'hidden' // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey)
            document.body.style.overflow = 'unset' // Restore scrolling
        }
    }, [showTrailer])

    if (movieLoading)
        return (
            <PageTransition>
                <div className="min-h-screen bg-brand flex items-center justify-center text-white">
                    Loading...
                </div>
            </PageTransition>
        )

    if (movieError || (!movieLoading && !movie))
        return (
            <PageTransition>
                <div className="min-h-screen bg-brand flex items-center justify-center text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
                        <p className="text-secondary mb-4">
                            {movieError?.message || 'The requested movie could not be loaded.'}
                        </p>
                        <p className="text-sm text-secondary">Movie ID: {movieId}</p>
                        <Link to="/" className="btn-primary mt-4 inline-block">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </PageTransition>
        )

    // Type guard - ensure movie exists before rendering
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
            <div className="min-h-screen bg-brand">
                <div className="container-custom py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Movies', path: '/' },
                            { label: movie?.name || 'Movie Details', isActive: true }
                        ]}
                    />

                    {/* Movie Hero Section */}
                    <div className="bg-surface rounded-lg overflow-hidden shadow-lg mb-8">
                        <div className="flex flex-col lg:flex-row">
                            {/* Poster */}
                            <div className="w-full lg:w-80 relative">
                                <img
                                    src={movie.poster}
                                    alt={movie.name}
                                    className="w-full h-[400px] lg:h-[500px] object-cover"
                                />
                                <div
                                    className={`absolute top-3 right-3 px-2 py-1 rounded text-white text-xs font-bold shadow-md ${getAgeColor(movie.ageLimit)}`}
                                >
                                    {movie.ageLimit}+
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 p-6 lg:p-8">
                                <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
                                    {movie.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-secondary mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-brand-primary" />
                                        <span className="text-sm">
                                            {formatDate(movie.releaseDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-brand-primary" />
                                        <span className="text-sm">
                                            {formatDuration(movie.duration)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-primary mb-2">
                                        Genres
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.map((genre: { id: string; name: string }) => (
                                            <span
                                                key={genre.id}
                                                className="px-3 py-1 bg-brand-secondary text-white rounded-full text-xs font-medium shadow-sm"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-primary mb-2">
                                        Plot
                                    </h3>
                                    <p className="text-secondary leading-relaxed text-sm">
                                        {movie.description}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-brand-primary" />
                                        Director
                                    </h3>
                                    <p className="text-secondary text-sm font-medium">
                                        {movie.director}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-4">
                                    {movie.trailer && (
                                        <button
                                            onClick={() => setShowTrailer(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-md text-sm"
                                        >
                                            <Play className="w-4 h-4" />
                                            Watch Trailer
                                        </button>
                                    )}
                                    <button className="btn-primary px-6 py-2 text-sm shadow-md">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cast Section */}
                    <div className="bg-surface rounded-lg p-6 mb-8 shadow-lg">
                        <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-primary" />
                            Cast
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                            {movie.actors.map(
                                (actor: { id: string; name: string; picture: string }) => (
                                    <Link
                                        key={actor.id}
                                        to="/actor/$actorId"
                                        params={{ actorId: actor.id }}
                                        className="text-center block group"
                                    >
                                        <img
                                            src={actor.picture || '/default-avatar.jpg'}
                                            alt={actor.name}
                                            className="w-16 h-16 rounded-full object-cover mx-auto shadow-md group-hover:scale-105 transition-transform border-2 border-transparent group-hover:border-brand-primary"
                                        />
                                        <p className="text-xs font-medium text-primary mt-2 group-hover:text-brand-primary">
                                            {actor.name}
                                        </p>
                                    </Link>
                                )
                            )}
                        </div>
                    </div>

                    {/* Similar Movies */}
                    {!similarLoading && similarMovies && similarMovies.length > 0 && (
                        <SimilarMoviesSection movies={similarMovies} />
                    )}
                </div>

                {/* Trailer Modal - Always Centered on Current Viewport */}
                {showTrailer && (
                    <div
                        className="modal-overlay bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowTrailer(false)}
                    >
                        <div
                            className="relative w-full bg-surface rounded-2xl overflow-hidden shadow-2xl border-4 border-black/80 scale-in"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                maxWidth: 'min(90vw, 80rem)',
                                maxHeight: 'min(85vh, 60rem)'
                            }}
                        >
                            <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={
                                        movie.trailer.replace('watch?v=', 'embed/') +
                                        '?autoplay=1&rel=0&modestbranding=1'
                                    }
                                    title={`${movie.name} Trailer`}
                                    allowFullScreen
                                    allow="autoplay; encrypted-media"
                                    className="absolute top-0 left-0 w-full h-full border-2 border-black"
                                    style={{ border: 'none' }}
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
