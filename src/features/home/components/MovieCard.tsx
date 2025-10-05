import { apiClient } from '@/shared/api/api-client'
import type { Movie } from '@/shared/data/mockMovies'
import { Link } from '@tanstack/react-router'
import { Calendar, Clock, Play, User, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface MovieCardProps {
    movie: Movie
    size?: 'small' | 'medium' | 'large'
}

interface MovieDetail {
    id: string
    name: string
    description: string
    duration: number
    ageLimit: number
    director: string
    trailer: string
    poster: string
    releaseDate: string
    genres: Array<{ id: string; name: string }>
    actors: Array<{ id: string; name: string; picture: string }>
}

const genreColors: Record<string, string> = {
    Action: 'bg-red-500/20 text-red-400 border-red-500/30',
    Drama: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Comedy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Horror: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Romance: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    SCIFI: 'bg-green-500/20 text-green-400 border-green-500/30',
    Fantasy: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Thriller: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const sizeClasses = {
        small: 'w-40 h-56',
        medium: 'w-48 h-72',
        large: 'w-56 h-80'
    }

    useEffect(() => {
        if (isHovered && !movieDetail && !loading) {
            hoverTimeoutRef.current = setTimeout(async () => {
                try {
                    setLoading(true)
                    const response = await apiClient.get(`/movies/${movie.id}`)
                    if (response.data.success) {
                        setMovieDetail(response.data.data)
                        setShowModal(true)
                    }
                } catch (error) {
                    console.error('Error fetching movie details:', error)
                } finally {
                    setLoading(false)
                }
            }, 500)
        }

        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current)
            }
        }
    }, [isHovered, movie.id, movieDetail, loading])

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setIsHovered(false)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <>
            <div
                ref={cardRef}
                className={`group cursor-pointer ${sizeClasses[size].split(' ')[0]} flex-shrink-0 block relative`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link to="/movie/$movieId" params={{ movieId: movie.id }} className="block">
                    <div
                        className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden shadow-lg`}
                    >
                        <div className="absolute inset-0 bg-[#242b3d] rounded-xl overflow-hidden">
                            {/* Poster */}
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src =
                                        'https://via.placeholder.com/300x450/242b3d/fe7e32?text=Movie'
                                }}
                                crossOrigin="anonymous"
                            />

                            {/* Age Rating Badge */}
                            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-[#fe7e32]/50">
                                <span className="text-[#fe7e32] text-xs font-bold">
                                    {movie.ageRating || `${movie.ageLimit || 18}+`}
                                </span>
                            </div>

                            {/* Rating Badge */}
                            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                <svg
                                    className="w-3 h-3 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white text-xs font-semibold">
                                    {movie.rating}
                                </span>
                            </div>

                            {/* Bottom info - always visible */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                                    {movie.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
                                    <Clock className="w-3 h-3" />
                                    <span>{movie.duration} min</span>
                                </div>
                            </div>

                            {/* Loading spinner */}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <div className="w-8 h-8 border-2 border-[#fe7e32] border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Hover Modal Popup - RESPONSIVE */}
            {showModal && movieDetail && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-2 sm:p-4"
                    onClick={handleCloseModal}
                >
                    <div
                        className="relative max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full bg-[#242b3d] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>

                        {/* Content */}
                        <div className="flex flex-col md:flex-row">
                            {/* Poster */}
                            <div className="w-full md:w-1/3 relative h-48 sm:h-64 md:h-auto">
                                <img
                                    src={movieDetail.poster}
                                    alt={movieDetail.name}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#242b3d] to-transparent" />
                            </div>

                            {/* Details */}
                            <div className="w-full md:w-2/3 p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh]">
                                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    {movieDetail.name}
                                </h2>

                                {/* Genres */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    {movieDetail.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${
                                                genreColors[genre.name] || genreColors.default
                                            }`}
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Meta info */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#fe7e32]" />
                                        <span className="text-xs sm:text-sm">
                                            {movieDetail.duration} min
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#648ddb]" />
                                        <span className="text-xs sm:text-sm">
                                            {formatDate(movieDetail.releaseDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#fe7e32]" />
                                        <span className="text-xs sm:text-sm truncate">
                                            {movieDetail.director}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
                                        <span className="text-xs sm:text-sm font-semibold text-[#fe7e32]">
                                            {movieDetail.ageLimit}+
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-3 sm:mb-4">
                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                                        Synopsis
                                    </h3>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                                        {movieDetail.description}
                                    </p>
                                </div>

                                {/* Cast */}
                                {movieDetail.actors.length > 0 && (
                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                                            Cast
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {movieDetail.actors.slice(0, 5).map((actor) => (
                                                <span
                                                    key={actor.id}
                                                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#1a2232] text-gray-300 rounded-full text-[10px] sm:text-xs"
                                                >
                                                    {actor.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                                    <Link
                                        to="/movie/$movieId"
                                        params={{ movieId: movieDetail.id }}
                                        className="flex-1 bg-gradient-to-r from-[#fe7e32] to-[#648ddb] text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        Book Tickets
                                    </Link>
                                    {movieDetail.trailer && (
                                        <a
                                            href={movieDetail.trailer}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#1a2232] text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:bg-[#fe7e32] transition-all duration-300"
                                        >
                                            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Trailer
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MovieCard
