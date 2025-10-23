import type { Movie } from '@/shared/data/mockMovies'
import { Link } from '@tanstack/react-router'
import { Clock, Film } from 'lucide-react'
import React from 'react'

interface MovieCardProps {
    movie: Movie
    size?: 'small' | 'medium' | 'large'
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-40 h-60',
        medium: 'w-48 h-72',
        large: 'w-56 h-84'
    }

    return (
        <Link
            to="/movie/$movieId"
            params={{ movieId: movie.id }}
            className={`group relative block bg-black ${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded-xl shadow-lg`}
        >
            <div className="absolute inset-0">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src =
                            'https://via.placeholder.com/300x450/242b3d/fe7e32?text=Movie'
                    }}
                    crossOrigin="anonymous"
                />
            </div>

            {/* Static Info at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                    {movie.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
                    <Clock className="w-3 h-3" />
                    <span>{movie.duration} min</span>
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/70 bg-gradient-to-t from-black/90 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {movie.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre}
                                className="px-2 py-0.5 bg-white/10 text-gray-300 rounded-full text-[10px] font-medium"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                    <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#fe7e32] to-[#648ddb] py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105">
                        <Film className="w-4 h-4" />
                        View Details
                    </button>
                </div>
            </div>

            {/* Age Rating Badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                <span className="text-white text-xs font-bold">
                    {movie.ageRating || `${movie.ageLimit || 18}+`}
                </span>
            </div>
        </Link>
    )
}

export default MovieCard
