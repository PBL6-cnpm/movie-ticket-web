import type { Movie } from '@/shared/data/mockMovies'
import { Link } from '@tanstack/react-router'
import React from 'react'

interface MovieCardProps {
    movie: Movie
    size?: 'small' | 'medium' | 'large'
}

// Age rating style
const ageRatingColors: Record<string, string> = {
    '18+': 'border-red-500 text-red-500',
    '13+': 'border-orange-400 text-orange-400',
    All: 'border-green-500 text-green-500',
    default: 'border-gray-400 text-gray-400'
}

// Genre -> màu pastel border
const genreColors: Record<string, string> = {
    Action: 'border-red-400 text-red-400',
    Drama: 'border-blue-400 text-blue-400',
    Comedy: 'border-yellow-400 text-yellow-600',
    Horror: 'border-purple-400 text-purple-400',
    Romance: 'border-pink-400 text-pink-400',
    SciFi: 'border-green-400 text-green-400',
    Fantasy: 'border-indigo-400 text-indigo-400',
    Thriller: 'border-orange-400 text-orange-400',
    Adventure: 'border-teal-400 text-teal-400',
    Animation: 'border-cyan-400 text-cyan-400',
    default: 'border-gray-400 text-gray-400'
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-40 h-56',
        medium: 'w-48 h-72',
        large: 'w-56 h-80'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Age badge
    const getAgeBadge = () => {
        const ageRating = movie.ageRating || `${movie.ageLimit || 18}+`
        const colorClass = ageRatingColors[ageRating] || ageRatingColors.default
        return (
            <span
                className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-md font-bold border bg-black/40 backdrop-blur-sm ${colorClass}`}
            >
                {ageRating}
            </span>
        )
    }

    // Genre (only first one)
    const getFirstGenre = () => {
        if (!movie.genres || movie.genres.length === 0) return null
        const genre = movie.genres[0]
        const colorClass = genreColors[genre] || genreColors.default
        return (
            <span
                key={genre}
                className={`text-[11px] ${colorClass} border px-2 py-0.5 rounded-full font-medium`}
            >
                {genre}
            </span>
        )
    }

    return (
        <Link
            to="/movie/$movieId"
            params={{ movieId: movie.id }}
            className={`group cursor-pointer hover-lift hover-scale ${sizeClasses[size].split(' ')[0]} flex-shrink-0 block`}
        >
            <div
                className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden shadow-md bg-surface border border-surface`}
            >
                {/* Poster */}
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src =
                            'https://via.placeholder.com/300x450/374151/ffffff?text=Movie+Poster'
                    }}
                    crossOrigin="anonymous"
                />

                {/* Age Badge */}
                {getAgeBadge()}

                {/* Rating */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center shadow-sm">
                    <svg
                        className="w-3 h-3 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.rating}
                </div>

                {/* Genre (only 1) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-2 py-2 flex flex-wrap gap-1">
                    {getFirstGenre()}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center">
                        <button className="btn-primary whitespace-nowrap mb-2 shadow-md">
                            Book Ticket
                        </button>
                        <p className="text-primary text-sm whitespace-nowrap font-semibold">
                            View Details
                        </p>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1 w-full">
                <h3 className="font-semibold text-primary text-sm group-hover:text-brand-primary transition-colors leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                    {movie.title}
                </h3>
                <div className="flex items-center text-xs text-secondary space-x-2 overflow-hidden">
                    <span className="whitespace-nowrap flex-shrink-0">{movie.duration} min</span>
                    <span className="flex-shrink-0">•</span>
                    <span className="whitespace-nowrap truncate">
                        {formatDate(movie.releaseDate)}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default MovieCard
