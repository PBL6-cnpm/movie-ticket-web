import { useAuthStore } from '@/features/auth/stores/auth.store'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
    Calendar,
    ChevronDown,
    Clock,
    Film,
    MapPin,
    Play,
    Star,
    Ticket,
    User,
    Users,
    X
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useBookingStore } from '../stores/booking.store'

// UTILITIES & HOOKS
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import { useScrollToTop } from '../../../shared/hooks/useScrollToTop'
import {
    useBranches,
    useBranchMovieShowTimes,
    type ShowTimeDay
} from '../../home/hooks/useBookingApi'
import { useMovieDetail, useSimilarMovies } from '../hooks/useMovieDetail'
// ----- HELPER FUNCTIONS -----
const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

const getAgeColor = (ageLimit: number) => {
    if (ageLimit >= 18) return 'bg-red-600'
    if (ageLimit >= 16) return 'bg-orange-500'
    if (ageLimit >= 13) return 'bg-yellow-500'
    return 'bg-green-500'
}

// ----- SUB-COMPONENTS -----

// Component cho phần Hero của phim
interface Movie {
    id: string
    name: string
    description: string
    poster: string
    backdrop: string
    releaseDate: string
    duration: number
    ageLimit: number
    director: string
    trailer?: string
    genres: Array<{ id: string; name: string }>
}

const MovieHero = ({ movie, onWatchTrailer }: { movie: Movie; onWatchTrailer: () => void }) => (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl isolate">
        {/* Backdrop Image with Gradient Overlay */}
        <div className="absolute inset-0 z-[-1]">
            <img src={movie.backdrop} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2232] via-[#1a2232]/80 to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                <img
                    src={movie.poster}
                    alt={movie.name}
                    className="w-60 md:w-64 rounded-xl shadow-lg border-2 border-white/10"
                />
                <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-md text-white text-xs font-bold shadow-lg ${getAgeColor(
                        movie.ageLimit
                    )}`}
                >
                    {movie.ageLimit}+
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-white flex flex-col justify-between py-2">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.name}</h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[#cccccc]">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#fe7e32]" />
                            <span>{formatDate(movie.releaseDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#fe7e32]" />
                            <span>{formatDuration(movie.duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="font-semibold">8.5 / 10</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {movie.genres.map((genre: { id: string; name: string }) => (
                            <span
                                key={genre.id}
                                className="px-3 py-1 bg-[#242b3d] border border-white/10 text-white rounded-full text-xs"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-[#fe7e32]">Synopsis</h3>
                        <p className="text-[#cccccc] leading-relaxed text-sm max-w-2xl">
                            {movie.description}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 items-center">
                    {movie.trailer && (
                        <button
                            onClick={onWatchTrailer}
                            className="flex items-center gap-2 px-6 py-3 bg-[#fe7e32] hover:bg-opacity-90 text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#fe7e32]/20 hover:shadow-[#fe7e32]/40 transform hover:scale-105"
                        >
                            <Play className="w-5 h-5" />
                            Watch Trailer
                        </button>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                        <User className="w-5 h-5 text-[#648ddb]" />
                        <span className="text-[#cccccc]">Director:</span>
                        <span className="font-medium text-white">{movie.director}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

// Component cho danh sách diễn viên
const CastSection = ({
    actors
}: {
    actors: Array<{ id: string; name: string; picture: string }>
}) => (
    <div className="bg-[#242b3d] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-[#fe7e32]" />
            Cast & Crew
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {actors.map((actor: { id: string; name: string; picture: string }) => (
                <Link
                    key={actor.id}
                    to="/actor/$actorId"
                    params={{ actorId: actor.id }}
                    className="text-center group"
                >
                    <div className="relative mb-2">
                        <img
                            src={actor.picture || '/default-avatar.jpg'}
                            alt={actor.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg transition-all border-2 border-transparent group-hover:border-[#fe7e32] group-hover:scale-105"
                        />
                    </div>
                    <p className="text-xs font-medium text-[#cccccc] group-hover:text-white transition-colors">
                        {actor.name}
                    </p>
                </Link>
            ))}
        </div>
    </div>
)

// Component cho phần đặt vé
const BookingSection = ({ movieId }: { movieId: string }) => {
    const navigate = useNavigate()
    const [selectedCinema, setSelectedCinema] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedShowtime, setSelectedShowtime] = useState('')

    const { data: branches = [], isLoading: branchesLoading } = useBranches()
    const { data: showTimeDays = [], isLoading: showTimesLoading } = useBranchMovieShowTimes(
        movieId,
        selectedCinema
    )

    const { isAuthenticated } = useAuthStore()
    const { setBookingState } = useBookingStore()

    // Available dates from showtimes
    const availableDates = useMemo(() => {
        return showTimeDays.map((day: ShowTimeDay) => ({
            value: day.dayOfWeek.value.split('T')[0],
            label: `${day.dayOfWeek.name}, ${new Date(day.dayOfWeek.value).toLocaleDateString(
                'vi-VN',
                {
                    day: '2-digit',
                    month: '2-digit'
                }
            )}`
        }))
    }, [showTimeDays])

    // Available showtimes for selected date
    const availableShowtimes = useMemo(() => {
        if (!selectedDate) return []
        const selectedDay = showTimeDays.find(
            (day: ShowTimeDay) => day.dayOfWeek.value.split('T')[0] === selectedDate
        )
        return selectedDay?.times || []
    }, [showTimeDays, selectedDate])

    const handleCinemaChange = (value: string) => {
        setSelectedCinema(value)
        setSelectedDate('')
        setSelectedShowtime('')
    }

    const handleDateChange = (value: string) => {
        setSelectedDate(value)
        setSelectedShowtime('')
    }

    const handleShowtimeSelect = (showtimeId: string) => {
        setSelectedShowtime(showtimeId)
        const token = localStorage.getItem('accessToken')
        const bookingPayload = {
            movieId,
            showtimeId,
            branchId: selectedCinema,
            date: selectedDate
        }

        if (!isAuthenticated && !token) {
            setBookingState({
                ...bookingPayload,
                redirectUrl: '/booking'
            })
            navigate({ to: '/login' })
        } else {
            setBookingState(bookingPayload)
            navigate({ to: '/booking' })
        }
    }

    const selectedCinemaName = branches.find((b) => b.id === selectedCinema)?.name || 'Cinema'

    if (branchesLoading) {
        return (
            <div className="bg-[#242b3d] rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
                <div className="flex items-center gap-3 text-white">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fe7e32]"></div>
                    Loading booking options...
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#242b3d] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#fe7e32] rounded-lg flex items-center justify-center shadow-lg shadow-[#fe7e32]/20">
                    <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Book Your Seats</h3>
                    <p className="text-sm text-[#cccccc]">Fast, easy and secure</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cinema Selection */}
                    <div>
                        <label className="text-sm font-medium text-[#cccccc] mb-2 block">
                            Cinema
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCinema}
                                onChange={(e) => handleCinemaChange(e.target.value)}
                                className="w-full bg-[#1a2232] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fe7e32] appearance-none cursor-pointer"
                            >
                                <option value="">Select Cinema</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    {/* Date Selection */}
                    <div>
                        <label className="text-sm font-medium text-[#cccccc] mb-2 block">
                            Date
                        </label>
                        <div className="relative">
                            <select
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                disabled={!selectedCinema}
                                className="w-full bg-[#1a2232] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fe7e32] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {!selectedCinema
                                        ? 'Select Cinema First'
                                        : showTimesLoading
                                          ? 'Loading...'
                                          : 'Select Date'}
                                </option>
                                {availableDates.map((date: { value: string; label: string }) => (
                                    <option key={date.value} value={date.value}>
                                        {date.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Showtimes */}
                {selectedDate && selectedCinema && (
                    <div>
                        <label className="text-sm font-medium text-[#cccccc] mb-3 block flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#648ddb]" />
                            Showtimes at {selectedCinemaName}
                        </label>
                        {availableShowtimes.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {availableShowtimes.map(
                                    (showtime: {
                                        id: string
                                        time: string
                                        availableSeats?: number
                                        totalSeats?: number
                                    }) => (
                                        <button
                                            key={showtime.id}
                                            onClick={() => handleShowtimeSelect(showtime.id)}
                                            className={`px-5 py-2 rounded-lg font-medium transition-all text-sm border-2 ${
                                                selectedShowtime === showtime.id
                                                    ? 'bg-[#fe7e32] border-[#fe7e32] text-white scale-105 shadow-lg shadow-[#fe7e32]/20'
                                                    : 'bg-transparent border-white/20 hover:border-[#fe7e32] text-white'
                                            }`}
                                            aria-live="polite"
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <span>{showtime.time}</span>
                                                {typeof showtime.availableSeats === 'number' &&
                                                    typeof showtime.totalSeats === 'number' && (
                                                        <span className="text-xs text-[#cccccc]">
                                                            {showtime.availableSeats}/
                                                            {showtime.totalSeats} seats
                                                        </span>
                                                    )}
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-[#1a2232] rounded-lg">
                                <p className="text-[#cccccc]">No showtimes available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// Component cho danh sách phim tương tự
const SimilarMoviesSection = ({
    genres,
    currentMovieId
}: {
    genres: string[]
    currentMovieId: string
}) => {
    const { data: similarMovies, isLoading } = useSimilarMovies(genres, currentMovieId)

    if (isLoading) {
        return (
            <div className="bg-[#242b3d] rounded-2xl p-6 shadow-xl border border-white/5 sticky top-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-20 h-28 bg-slate-700 rounded-lg"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-700 rounded"></div>
                                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#242b3d] rounded-2xl p-6 shadow-xl border border-white/5 sticky top-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#fe7e32]" />
                You Might Also Like
            </h3>
            <div className="space-y-4">
                {similarMovies?.slice(0, 5).map((similar) => (
                    <Link
                        key={similar.id}
                        to="/movie/$movieId"
                        params={{ movieId: similar.id }}
                        className="group block"
                    >
                        <div className="flex gap-4 bg-[#1a2232]/50 hover:bg-[#1a2232] rounded-lg p-2 transition-all border border-transparent hover:border-[#fe7e32]/50">
                            <img
                                src={similar.poster}
                                alt={similar.name}
                                className="flex-shrink-0 w-16 h-24 object-cover rounded-md"
                            />
                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-[#fe7e32] transition-colors">
                                    {similar.name}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-[#cccccc]">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span>8.2</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// Component cho Modal Trailer
const TrailerModal = ({ trailerUrl, onClose }: { trailerUrl: string; onClose: () => void }) => {
    // Ngăn chặn việc đóng modal khi click vào nội dung bên trong
    const handleContentClick = (e: React.MouseEvent) => e.stopPropagation()

    return (
        <div
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                aria-label="Close trailer"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            <div
                className="relative w-full max-w-4xl aspect-video bg-[#1a2232] rounded-lg overflow-hidden shadow-2xl animate-scale-in"
                onClick={handleContentClick}
            >
                <iframe
                    src={`${trailerUrl.replace('watch?v=', 'embed/')}?autoplay=1&rel=0&modestbranding=1`}
                    title="Movie Trailer"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    className="absolute top-0 left-0 w-full h-full"
                ></iframe>
            </div>
        </div>
    )
}

// ----- MAIN PAGE COMPONENT -----
const MovieDetailPage: React.FC = () => {
    const { movieId } = useParams({ from: '/movie/$movieId' })
    const { data: movie, isLoading, error } = useMovieDetail(movieId)
    const [showTrailer, setShowTrailer] = useState(false)

    // Scroll to top when component mounts to prevent auto-scroll to bottom
    useScrollToTop()

    // Scroll lock effect for modal
    // useEffect(() => {
    //     if (showTrailer) {
    //         document.body.style.overflow = 'hidden'
    //     } else {
    //         document.body.style.overflow = ''
    //     }
    //     // Cleanup function
    //     return () => {
    //         document.body.style.overflow = ''
    //     }
    // }, [showTrailer])

    if (isLoading)
        return (
            <PageTransition>
                <div className="min-h-screen bg-[#1a2232] flex items-center justify-center text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-[#fe7e32] border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading movie details...</p>
                    </div>
                </div>
            </PageTransition>
        )

    if (error || !movie)
        return (
            <PageTransition>
                <div className="min-h-screen bg-[#1a2232] flex items-center justify-center text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Oops! Movie not found.</h2>
                        <Link to="/" className="px-6 py-2 bg-[#fe7e32] rounded-lg">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </PageTransition>
        )

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#1a2232] text-white">
                <div className="container-custom py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Movies', path: '/' },
                            { label: movie.name, isActive: true }
                        ]}
                    />

                    <div className="flex flex-col lg:flex-row gap-8 mt-6">
                        {/* Left Column - Main Content */}
                        <div className="w-full lg:w-[calc(100%-22rem)] space-y-8">
                            <MovieHero movie={movie} onWatchTrailer={() => setShowTrailer(true)} />
                            <CastSection actors={movie.actors} />
                            <BookingSection movieId={movieId} />
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="hidden lg:block lg:w-80 flex-shrink-0">
                            <SimilarMoviesSection
                                genres={movie.genres.map(
                                    (g: { id: string; name: string }) => g.name
                                )}
                                currentMovieId={movieId}
                            />
                        </div>
                    </div>
                </div>

                {/* Trailer Modal */}
                {showTrailer && movie.trailer && (
                    <TrailerModal
                        trailerUrl={movie.trailer}
                        onClose={() => setShowTrailer(false)}
                    />
                )}
            </div>
        </PageTransition>
    )
}

export default MovieDetailPage
