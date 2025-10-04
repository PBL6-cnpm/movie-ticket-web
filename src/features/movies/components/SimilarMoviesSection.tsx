import { Link } from '@tanstack/react-router'
import { Calendar, Clock } from 'lucide-react'
import React from 'react'

interface Movie {
    id: number
    name: string
    poster: string
    releaseDate: string
    duration: number
    genres: Array<{ id: number; name: string }>
}

interface SimilarMoviesSectionProps {
    movies: Movie[]
}

const SimilarMoviesSection: React.FC<SimilarMoviesSectionProps> = ({ movies }) => {
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}phút` : `${mins}phút`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="bg-surface rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-primary mb-8">Phim tương tự</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        to="/movie/$movieId"
                        params={{ movieId: movie.id.toString() }}
                        className="group"
                    >
                        <div className="bg-brand rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                            <div className="relative">
                                <img
                                    src={movie.poster}
                                    alt={movie.name}
                                    className="w-full h-72 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-4">
                                <h4 className="text-primary font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                                    {movie.name}
                                </h4>
                                <div className="space-y-2 text-sm text-secondary">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-brand-primary" />
                                        {formatDate(movie.releaseDate)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-brand-primary" />
                                        {formatDuration(movie.duration)}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {movie.genres.slice(0, 2).map((genre) => (
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
        </div>
    )
}

export default SimilarMoviesSection
