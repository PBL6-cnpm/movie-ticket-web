import { Link } from '@tanstack/react-router'
import { Calendar, ChevronLeft, ChevronRight, Clock, Grid3X3 } from 'lucide-react'
import React from 'react'
import type { Movie } from '../../../shared/types/movies.types'

interface MoviesGridProps {
    movies: Movie[]
    isLoading: boolean
    error: Error | null
    currentPage: number
    totalCount: number
    totalPages: number
    onPageChange: (page: number) => void
}

const MoviesGrid: React.FC<MoviesGridProps> = ({
    movies,
    isLoading,
    error,
    currentPage,
    totalCount,
    totalPages,
    onPageChange
}) => {
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        })

    const getAgeColor = (ageLimit: number) => {
        if (ageLimit >= 18) return 'bg-red-500 border-red-500'
        if (ageLimit >= 16) return 'bg-yellow-500 border-yellow-500'
        if (ageLimit >= 13) return 'bg-orange-500 border-orange-500'
        return 'bg-green-500 border-green-500'
    }

    const renderPagination = () => {
        const pages = []
        const maxVisiblePages = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        i === currentPage
                            ? 'bg-brand-primary text-white'
                            : 'bg-surface text-secondary hover:bg-brand-primary/10'
                    }`}
                >
                    {i}
                </button>
            )
        }

        return pages
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="bg-surface rounded-lg p-6 shadow-lg">
                    <div className="h-6 bg-brand/20 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-brand/20 rounded w-1/2 animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-surface rounded-lg overflow-hidden shadow-lg animate-pulse"
                        >
                            <div className="h-72 bg-brand/20"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-brand/20 rounded"></div>
                                <div className="h-3 bg-brand/20 rounded w-3/4"></div>
                                <div className="h-3 bg-brand/20 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-surface rounded-lg p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold text-primary mb-2">Error Loading Movies</h3>
                <p className="text-secondary mb-4">
                    {error?.message || 'Something went wrong while loading movies.'}
                </p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-surface rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Grid3X3 className="w-5 h-5 text-brand-primary" />
                            Movies
                        </h2>
                        <p className="text-secondary text-sm">
                            Showing {movies.length} of {totalCount} movies
                        </p>
                    </div>
                </div>
            </div>

            {/* Movies Grid */}
            {movies.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {movies.map((movie) => (
                            <Link
                                key={movie.id}
                                to="/movie/$movieId"
                                params={{ movieId: movie.id }}
                                className="group"
                            >
                                <div className="bg-surface rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                                    {/* Movie Poster */}
                                    <div className="relative">
                                        <img
                                            src={movie.poster}
                                            alt={movie.name}
                                            className="w-full h-72 object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.src = `https://via.placeholder.com/300x450/648ddb/ffffff?text=${encodeURIComponent(movie.name.substring(0, 10))}`
                                            }}
                                        />

                                        {/* Age Rating Badge */}
                                        <div
                                            className={`absolute top-3 right-3 px-2 py-1 rounded text-white text-xs font-bold ${getAgeColor(movie.ageLimit)}`}
                                        >
                                            {movie.ageLimit}+
                                        </div>

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Movie Info */}
                                    <div className="p-4">
                                        <h3 className="text-primary font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                                            {movie.name}
                                        </h3>

                                        <p className="text-secondary text-sm mb-3 line-clamp-2">
                                            {movie.description}
                                        </p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-secondary">
                                                <Calendar className="w-4 h-4 text-brand-primary" />
                                                {formatDate(movie.releaseDate)}
                                            </div>
                                            <div className="flex items-center gap-2 text-secondary">
                                                <Clock className="w-4 h-4 text-brand-primary" />
                                                {formatDuration(movie.duration)}
                                            </div>
                                        </div>

                                        {/* Genres */}
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {movie.genres
                                                .slice(0, 2)
                                                .map((genre: { id: string; name: string }) => (
                                                    <span
                                                        key={genre.id}
                                                        className="px-2 py-1 bg-brand-secondary/20 text-brand-secondary rounded text-xs font-medium"
                                                    >
                                                        {genre.name}
                                                    </span>
                                                ))}
                                            {movie.genres.length > 2 && (
                                                <span className="px-2 py-1 bg-brand-secondary/20 text-brand-secondary rounded text-xs font-medium">
                                                    +{movie.genres.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-surface rounded-lg p-6 shadow-lg">
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded bg-surface text-secondary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {renderPagination()}

                                <button
                                    onClick={() =>
                                        onPageChange(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded bg-surface text-secondary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-surface rounded-lg p-12 shadow-lg text-center">
                    <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary mb-2">No Movies Found</h3>
                    <p className="text-secondary">
                        Try adjusting your filters to see more results.
                    </p>
                </div>
            )}
        </div>
    )
}

export default MoviesGrid
