import { Calendar, Clock, Play, User } from 'lucide-react'
import React from 'react'
import type { MoviePreview } from '../hooks/useMoviePreview'

interface MoviePreviewModalProps {
    movie: MoviePreview
    isVisible: boolean
    position: { x: number; y: number }
}

const MoviePreviewModal: React.FC<MoviePreviewModalProps> = ({ movie, isVisible, position }) => {
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })

    const getAgeColor = (ageLimit: number) => {
        if (ageLimit >= 18) return 'bg-red-500 border-red-500'
        if (ageLimit >= 16) return 'bg-yellow-500 border-yellow-500'
        if (ageLimit >= 13) return 'bg-orange-500 border-orange-500'
        return 'bg-green-500 border-green-500'
    }

    if (!isVisible) return null

    // Calculate optimal position to avoid going off-screen
    const modalWidth = 288 // w-72 = 288px
    const modalHeight = 120 // compact horizontal layout height
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768

    let left = position.x
    let top = position.y - modalHeight / 2 // Căn giữa modal theo chiều dọc

    // Adjust if modal goes off right edge
    if (left + modalWidth > windowWidth - 20) {
        left = position.x - modalWidth - 20 // Hiển thị bên trái movie card
    }

    // Adjust if modal goes off top edge
    if (top < 20) {
        top = 20
    }

    // Adjust if modal goes off bottom edge
    if (top + modalHeight > windowHeight - 20) {
        top = windowHeight - modalHeight - 20
    }

    return (
        <div className="fixed z-[9998] pointer-events-none" style={{ left, top }}>
            <div className="bg-surface rounded-lg shadow-2xl border border-brand-primary/20 overflow-hidden w-72 scale-in">
                {/* Movie Layout - Horizontal */}
                <div className="flex">
                    {/* Left - Movie Poster (Portrait) */}
                    <div className="relative w-20 flex-shrink-0">
                        <img
                            src={movie.poster}
                            alt={movie.name}
                            className="w-full h-28 object-cover"
                        />
                        <div
                            className={`absolute top-1 right-1 px-1 py-0.5 rounded text-white text-xs font-bold ${getAgeColor(movie.ageLimit)}`}
                        >
                            {movie.ageLimit}+
                        </div>
                        {movie.trailer && (
                            <div className="absolute bottom-1 right-1">
                                <div className="bg-red-600 rounded-full p-1">
                                    <Play className="w-2 h-2 text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Movie Info */}
                    <div className="flex-1 p-3">
                        <h3 className="text-primary font-bold text-xs mb-1 line-clamp-1">
                            {movie.name}
                        </h3>

                        <p className="text-secondary text-xs mb-2 line-clamp-2 leading-tight">
                            {movie.description}
                        </p>

                        {/* Movie Details */}
                        <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-1 text-secondary">
                                <Calendar className="w-2.5 h-2.5 text-brand-primary" />
                                <span className="text-xs">{formatDate(movie.releaseDate)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-secondary">
                                <Clock className="w-2.5 h-2.5 text-brand-primary" />
                                <span className="text-xs">{formatDuration(movie.duration)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-secondary">
                                <User className="w-2.5 h-2.5 text-brand-primary" />
                                <span className="text-xs line-clamp-1">{movie.director}</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-1">
                            {movie.genres.slice(0, 2).map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-1.5 py-0.5 bg-brand-secondary text-white rounded-full text-xs font-medium"
                                >
                                    {genre.name}
                                </span>
                            ))}
                            {movie.genres.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-500 text-white rounded-full text-xs font-medium">
                                    +{movie.genres.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoviePreviewModal
