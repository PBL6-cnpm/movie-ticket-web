import { Link } from '@tanstack/react-router'
import { Calendar, Film, X } from 'lucide-react'
import React from 'react'
import { useActorDetail } from '../hooks/useActorDetail'

interface ActorModalProps {
    actorId: string
    isOpen: boolean
    onClose: () => void
}

const ActorModal: React.FC<ActorModalProps> = ({ actorId, isOpen, onClose }) => {
    const { data: actor, isLoading, error } = useActorDetail(actorId)
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="relative bg-[#101218] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl animate-slideUp">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                >
                    <X className="w-5 h-5 text-white/80" />
                </button>

                {/* Header */}
                <div className="px-8 pt-8 pb-4 border-b border-white/10 text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        Actor Profile
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Explore detailed biography and filmography
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 text-gray-200 space-y-10">
                    {/* Loading */}
                    {isLoading && (
                        <div className="animate-pulse space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-8">
                                <div className="w-40 h-40 rounded-2xl bg-white/10" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-white/10 rounded w-2/3" />
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-4 bg-white/10 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-center py-16">
                            <Film className="w-14 h-14 mx-auto mb-4 text-red-400" />
                            <p className="text-lg font-medium">Failed to load actor details</p>
                            <p className="text-sm text-gray-500">Please try again later</p>
                        </div>
                    )}

                    {/* Actor info */}
                    {actor && (
                        <>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                <img
                                    src={
                                        actor.picture ||
                                        `https://via.placeholder.com/160x160/648ddb/ffffff?text=${actor.name?.charAt(0) ?? 'A'}`
                                    }
                                    alt={actor.name}
                                    className="w-40 h-40 rounded-2xl object-cover shadow-xl border border-white/10 bg-[#1a1d29]"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = `https://via.placeholder.com/160x160/648ddb/ffffff?text=${actor.name?.charAt(0) ?? 'A'}`
                                    }}
                                />

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                                        {actor.name}
                                    </h3>

                                    {actor.description ? (
                                        <p className="text-gray-400 leading-relaxed">
                                            {actor.description}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No biography available.
                                        </p>
                                    )}

                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mt-4">
                                        <Calendar className="w-4 h-4 text-brand-primary" />
                                        <span>
                                            Joined{' '}
                                            {new Date(actor.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Movies */}
                            <div className="pt-4">
                                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <Film className="w-5 h-5 text-brand-primary" />
                                    Filmography
                                    <span className="text-gray-500 font-normal">
                                        ({actor.movies?.length || 0})
                                    </span>
                                </h4>

                                {actor.movies && actor.movies.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {actor.movies.map(
                                            (movie: {
                                                id: string
                                                name: string
                                                poster: string
                                            }) => (
                                                <Link
                                                    key={movie.id}
                                                    to="/movie/$movieId"
                                                    params={{ movieId: movie.id }}
                                                    onClick={onClose}
                                                    className="group"
                                                >
                                                    <div className="flex gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                                                        <img
                                                            src={
                                                                movie.poster ||
                                                                'https://via.placeholder.com/80x112/648ddb/ffffff?text=Movie'
                                                            }
                                                            alt={movie.name}
                                                            className="w-20 h-28 object-cover rounded-xl shadow-md bg-brand-secondary"
                                                            onError={(e) => {
                                                                const target =
                                                                    e.target as HTMLImageElement
                                                                target.src =
                                                                    'https://via.placeholder.com/80x112/648ddb/ffffff?text=Movie'
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold text-white text-base line-clamp-2 group-hover:text-brand-primary transition-colors">
                                                                {movie.name}
                                                            </h5>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Click to view details
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No movies found for this actor</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ActorModal
