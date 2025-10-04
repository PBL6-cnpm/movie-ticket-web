import { Link, useParams } from '@tanstack/react-router'
import { Calendar, Film } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import { useActorDetail } from '../hooks/useActorDetail'
import { useMoviePreview } from '../hooks/useMoviePreview'
import MoviePreviewModal from '../components/MoviePreviewModal'

const ActorDetailPage: React.FC = () => {
    const params = useParams({ from: '/actor/$actorId' })
    const { data: actor, isLoading, error } = useActorDetail(params.actorId)
    const [hoveredMovieId, setHoveredMovieId] = useState<string | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
    
    const { data: previewMovie } = useMoviePreview(hoveredMovieId || '', !!hoveredMovieId)

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout)
            }
        }
    }, [hoverTimeout])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-4"></div>
                    <p className="text-secondary">Loading actor information...</p>
                </div>
            </div>
        )
    }

    if (error || !actor) {
        return (
            <div className="min-h-screen bg-brand flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Actor Not Found</h2>
                    <p className="text-secondary mb-6">
                        The actor information could not be loaded.
                    </p>
                    <Link to="/">
                        <button className="btn-primary">Back to Home</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand">
                <div className="container-custom py-8">
                    {/* Breadcrumb Navigation */}
                    <Breadcrumb
                        items={[
                            { label: 'Movies', path: '/' },
                            { label: 'Actors' },
                            { label: actor?.name || 'Actor Details', isActive: true }
                        ]}
                    />

                    {/* Actor Detail Layout */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Sidebar - Actor Info (25%) */}
                        <div className="lg:w-1/4">
                            <div className="bg-surface rounded-lg p-6 shadow-lg sticky top-8 scale-in">
                                {/* Actor Photo */}
                                <div className="text-center mb-6">
                                    <img
                                        src={actor.picture || '/default-avatar.jpg'}
                                        alt={actor.name}
                                        className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg border-4 border-brand-primary/30"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = `https://via.placeholder.com/192x192/648ddb/ffffff?text=${actor.name.charAt(0)}`
                                        }}
                                    />
                                </div>

                                {/* Actor Name */}
                                <h1 className="text-2xl font-bold text-primary text-center mb-4">
                                    {actor.name}
                                </h1>

                                {/* Actor Stats */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-secondary">
                                        <Film className="w-5 h-5 text-brand-primary" />
                                        <span className="text-sm">
                                            {actor.movies?.length || 0} Movies
                                        </span>
                                    </div>

                                    {actor.createdAt && (
                                        <div className="flex items-center gap-3 text-secondary">
                                            <Calendar className="w-5 h-5 text-brand-primary" />
                                            <span className="text-sm">
                                                Joined {formatDate(actor.createdAt)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Biography */}
                                {actor.description && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-primary mb-3">
                                            Biography
                                        </h3>
                                        <p className="text-secondary text-sm leading-relaxed">
                                            {actor.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Content - Movies (75%) */}
                        <div className="lg:w-3/4">
                            <div className="bg-surface rounded-lg p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                        <Film className="w-6 h-6 text-brand-primary" />
                                        Movies
                                    </h2>
                                    <span className="text-secondary text-sm">
                                        {actor.movies?.length || 0} total
                                    </span>
                                </div>

                                {/* Movies Grid */}
                                {actor.movies && actor.movies.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {actor.movies.map((movie) => (
                                            <Link
                                                key={movie.id}
                                                to="/movie/$movieId"
                                                params={{ movieId: movie.id }}
                                                className="group cursor-pointer"
                                                onMouseEnter={(e) => {
                                                    // Lấy vị trí của movie card element thay vì chuột
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    setMousePosition({ 
                                                        x: rect.right + 10, // Hiển thị bên phải movie card
                                                        y: rect.top + rect.height / 2 // Căn giữa theo chiều dọc
                                                    })
                                                    
                                                    // Clear existing timeout
                                                    if (hoverTimeout) {
                                                        clearTimeout(hoverTimeout)
                                                    }
                                                    
                                                    // Set new timeout to show modal after 200ms (nhanh hơn một chút)
                                                    const timeout = setTimeout(() => {
                                                        setHoveredMovieId(movie.id)
                                                    }, 200)
                                                    setHoverTimeout(timeout)
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredMovieId(null)
                                                    
                                                    // Clear timeout when leaving
                                                    if (hoverTimeout) {
                                                        clearTimeout(hoverTimeout)
                                                        setHoverTimeout(null)
                                                    }
                                                }}
                                            >
                                                <div className="relative bg-brand-secondary/20 rounded-lg overflow-hidden border border-brand-secondary/30">
                                                    <img
                                                        src={movie.poster || '/default-movie.jpg'}
                                                        alt={movie.name}
                                                        className="w-full h-64 object-cover shadow-md group-hover:shadow-xl transition-all group-hover:scale-105 bg-brand-secondary/20"
                                                        onError={(e) => {
                                                            const target =
                                                                e.target as HTMLImageElement
                                                            target.src = `https://via.placeholder.com/200x300/648ddb/ffffff?text=${encodeURIComponent(movie.name.substring(0, 3))}`
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-brand-primary bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                                                </div>

                                                {/* Movie Title */}
                                                <div className="mt-3">
                                                    <h3 className="text-primary font-medium text-sm group-hover:text-brand-primary transition-colors line-clamp-2">
                                                        {movie.name}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-primary mb-2">
                                            No Movies Found
                                        </h3>
                                        <p className="text-secondary">
                                            This actor hasn't appeared in any movies yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Movie Preview Modal */}
                {hoveredMovieId && (
                    <>
                        {previewMovie ? (
                            <MoviePreviewModal
                                movie={previewMovie}
                                isVisible={!!hoveredMovieId}
                                position={mousePosition}
                            />
                        ) : (
                            // Loading preview modal
                            <div
                                className="fixed z-[9998] pointer-events-none"
                                style={{
                                    left: mousePosition.x,
                                    top: mousePosition.y - 30
                                }}
                            >
                                <div className="bg-surface rounded-lg shadow-2xl border border-brand-primary/20 p-3 w-72 scale-in">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
                                        <span className="text-secondary text-sm">Loading movie info...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageTransition>
    )
}

export default ActorDetailPage
