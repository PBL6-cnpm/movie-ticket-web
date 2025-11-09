import { useAuthStore } from '@/features/auth/stores/auth.store'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
    Calendar,
    ChevronDown,
    Clock,
    Film,
    Loader2,
    MapPin,
    MessageCircle,
    Play,
    Send,
    Star,
    Ticket,
    User,
    Users,
    X
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useBookingStore } from '../stores/booking.store'

// UTILITIES & HOOKS
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import { useScrollToTop } from '../../../shared/hooks/useScrollToTop'
import {
    useBranches,
    useBranchMovieShowTimes,
    useMovieShowTimes,
    type Branch,
    type ShowTimeDay
} from '../../home/hooks/useBookingApi'
import { useMovieDetail, useSimilarMovies } from '../hooks/useMovieDetail'
import { useCreateReview, useDeleteReview, useMovieReviews } from '../hooks/useMovieReviews'
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

const formatReviewDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

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
    avgRating?: number | null
    averageRating?: number | null
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
                            <span className="font-semibold">
                                {(() => {
                                    const rating = movie.avgRating ?? movie.averageRating
                                    if (typeof rating === 'number') {
                                        return `${rating.toFixed(1)} / 10`
                                    }
                                    return 'Not rated yet'
                                })()}
                            </span>
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
const BookingSection = ({
    movieId,
    isUpcoming,
    showTimesError,
    showTimesErrorMessage
}: {
    movieId: string
    isUpcoming: boolean
    showTimesError: boolean
    showTimesErrorMessage?: string
}) => {
    const navigate = useNavigate()
    const [selectedCinema, setSelectedCinema] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedShowtime, setSelectedShowtime] = useState('')

    const { data: branches = [], isLoading: branchesLoading } = useBranches()
    const { data: showTimeDays = [], isLoading: showTimesLoading } = useBranchMovieShowTimes(
        movieId,
        selectedCinema
    )

    const sanitizedShowTimeDays = useMemo(() => {
        return showTimeDays
            .map((day: ShowTimeDay) => ({
                ...day,
                times: (day.times || []).filter((time) => Boolean(time?.id && time?.time))
            }))
            .filter((day) => day.times.length > 0)
    }, [showTimeDays])

    const { isAuthenticated } = useAuthStore()
    const { setBookingState } = useBookingStore()

    // Available dates from showtimes
    const availableDates = useMemo(() => {
        return sanitizedShowTimeDays.map((day: ShowTimeDay) => ({
            value: day.dayOfWeek.value.split('T')[0],
            label: `${day.dayOfWeek.name}, ${new Date(day.dayOfWeek.value).toLocaleDateString(
                'vi-VN',
                {
                    day: '2-digit',
                    month: '2-digit'
                }
            )}`
        }))
    }, [sanitizedShowTimeDays])

    // Available showtimes for selected date
    const availableShowtimes = useMemo(() => {
        if (!selectedDate) return []
        const selectedDay = sanitizedShowTimeDays.find(
            (day: ShowTimeDay) => day.dayOfWeek.value.split('T')[0] === selectedDate
        )
        return selectedDay?.times || []
    }, [sanitizedShowTimeDays, selectedDate])

    useEffect(() => {
        if (!selectedDate) return

        const exists = sanitizedShowTimeDays.some(
            (day: ShowTimeDay) => day.dayOfWeek.value.split('T')[0] === selectedDate
        )

        if (!exists) {
            setSelectedDate('')
            setSelectedShowtime('')
        }
    }, [selectedDate, sanitizedShowTimeDays])

    useEffect(() => {
        if (!selectedShowtime) return

        const exists = sanitizedShowTimeDays.some((day: ShowTimeDay) =>
            day.times.some((time) => time.id === selectedShowtime)
        )

        if (!exists) {
            setSelectedShowtime('')
        }
    }, [selectedShowtime, sanitizedShowTimeDays])

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

    useEffect(() => {
        if (!selectedCinema) return

        const exists = branches.some((branch: Branch) => branch.id === selectedCinema)

        if (!exists) {
            setSelectedCinema('')
            setSelectedDate('')
            setSelectedShowtime('')
        }
    }, [branches, selectedCinema])

    const selectedCinemaName =
        branches.find((branch: Branch) => branch.id === selectedCinema)?.name || 'Cinema'

    if (showTimesError) {
        return (
            <div className="bg-[#242b3d] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
                <Ticket className="w-10 h-10 text-[#fe7e32] mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Unable to load showtimes</h3>
                <p className="text-sm text-[#cccccc] max-w-md">
                    {showTimesErrorMessage ||
                        'We could not retrieve showtimes for this movie right now. Please try again later.'}
                </p>
            </div>
        )
    }

    if (isUpcoming) {
        return (
            <div className="bg-[#242b3d] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
                <Ticket className="w-10 h-10 text-[#fe7e32] mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Upcoming Release</h3>
                <p className="text-sm text-[#cccccc] max-w-md">
                    This movie does not have scheduled showtimes yet. Please check back soon once screenings are announced.
                </p>
            </div>
        )
    }

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

    if (!branches.length) {
        return (
            <div className="bg-[#242b3d] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
                <Ticket className="w-10 h-10 text-[#fe7e32] mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">No Showtimes Available</h3>
                <p className="text-sm text-[#cccccc] max-w-md">
                    This movie currently has no scheduled screenings at any cinema. Please check
                    back later or explore other movies showing now.
                </p>
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
                                {branches.map((branch: Branch) => (
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

const ReviewsSection = ({
    movieId,
    averageRating,
    canSubmit = true
}: {
    movieId: string
    averageRating?: number | null
    canSubmit?: boolean
}) => {
    const navigate = useNavigate()
    const { isAuthenticated, account } = useAuthStore()
    const [rating, setRating] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [comment, setComment] = useState('')
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null
    )
    const [manageFeedback, setManageFeedback] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    const ratingDisabled = !canSubmit

    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error } =
        useMovieReviews(movieId, { enabled: !ratingDisabled })
    const createReview = useCreateReview(movieId)
    const deleteReview = useDeleteReview(movieId)

    const reviews = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data])
    const userReview = useMemo(() => {
        if (!account?.id) return undefined
        return reviews.find((reviewItem) => reviewItem.account.id === account.id)
    }, [account?.id, reviews])
    const displayReviews = useMemo(() => {
        if (!account?.id) return reviews
        const owned = reviews.filter((reviewItem) => reviewItem.account.id === account.id)
        if (!owned.length) return reviews
        const others = reviews.filter((reviewItem) => reviewItem.account.id !== account.id)
        return [...owned, ...others]
    }, [account?.id, reviews])
    const totalReviews = data?.pages?.[0]?.meta?.total ?? 0
    const audienceScore = typeof averageRating === 'number' ? averageRating : null
    const currentRating = hoverRating || rating
    const isSubmitting = createReview.isPending
    const hasUserReview = Boolean(isAuthenticated && userReview)

    const resolveErrorMessage = (err: unknown, fallback: string) => {
        if (
            err &&
            typeof err === 'object' &&
            'message' in err &&
            typeof (err as { message?: string }).message === 'string'
        ) {
            return (err as { message: string }).message || fallback
        }
        return fallback
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!isAuthenticated) {
            navigate({ to: '/login' })
            return
        }

        if (!rating) {
            setFeedback({ type: 'error', message: 'Please select a rating before submitting.' })
            return
        }

        if (comment.trim().length < 3) {
            setFeedback({
                type: 'error',
                message: 'Please share a few words about the movie (min 3 characters).'
            })
            return
        }

        setFeedback(null)

        createReview.mutate(
            { rating, comment: comment.trim() },
            {
                onSuccess: () => {
                    setFeedback({ type: 'success', message: 'Thanks for sharing your review!' })
                    setRating(0)
                    setHoverRating(0)
                    setComment('')
                },
                onError: (error) => {
                    const message = resolveErrorMessage(
                        error,
                        'Unable to submit review. Please try again.'
                    )
                    setFeedback({ type: 'error', message })
                }
            }
        )
    }

    const handleSignIn = () => {
        navigate({ to: '/login' })
    }

    const handleCommentChange = (value: string) => {
        if (feedback) {
            setFeedback(null)
        }
        setComment(value)
    }

    const handleDeleteReview = () => {
        if (!userReview) return
        setManageFeedback(null)
        deleteReview.mutate(userReview.id, {
            onSuccess: () => {
                setManageFeedback({ type: 'success', message: 'Your review has been removed.' })
                setRating(0)
                setHoverRating(0)
                setComment('')
            },
            onError: (mutationError) => {
                const message = resolveErrorMessage(
                    mutationError,
                    'Could not remove your review. Please try again.'
                )
                setManageFeedback({ type: 'error', message })
            }
        })
    }

    const renderInteractiveStars = () => (
        <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: 10 }, (_, index) => {
                const starValue = index + 1
                const active = currentRating >= starValue

                return (
                    <button
                        key={starValue}
                        type="button"
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => {
                            setRating(starValue)
                            if (feedback) {
                                setFeedback(null)
                            }
                        }}
                        className="transition-transform hover:scale-110 focus:outline-none"
                    >
                        <Star
                            className="w-6 h-6"
                            strokeWidth={active ? 0 : 1.5}
                            fill={active ? '#facc15' : 'none'}
                            color={active ? '#facc15' : '#94a3b8'}
                        />
                    </button>
                )
            })}
            <span className="ml-2 text-sm text-[#9aa4b8]">
                {rating ? `${rating} / 10` : 'Select rating'}
            </span>
        </div>
    )

    const renderStaticStars = (value: number) => (
        <div className="flex items-center gap-1 flex-wrap">
            {Array.from({ length: 10 }, (_, index) => {
                const starValue = index + 1
                const active = value >= starValue

                return (
                    <Star
                        key={starValue}
                        className="w-4 h-4"
                        strokeWidth={active ? 0 : 1.5}
                        fill={active ? '#facc15' : 'none'}
                        color={active ? '#facc15' : '#94a3b8'}
                    />
                )
            })}
        </div>
    )

    if (ratingDisabled) {
        return (
            <div className="bg-[#242b3d] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#fe7e32]/15 border border-[#fe7e32]/30 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-[#fe7e32]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Audience Reviews</h3>
                        <p className="text-sm text-[#9aa4b8]">Reviews will open once showtimes are live.</p>
                    </div>
                </div>
                <div className="bg-[#1a2232] border border-white/10 rounded-xl p-5 text-sm text-[#cccccc]">
                    This movie is getting ready for release. Ratings and comments will be available when showtimes are announced.
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#242b3d] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#fe7e32]/15 border border-[#fe7e32]/30 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-[#fe7e32]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Audience Reviews</h3>
                        <p className="text-sm text-[#9aa4b8]">What moviegoers are saying</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#cccccc]">
                    {audienceScore !== null && (
                        <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                            {audienceScore.toFixed(1)} / 10
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                        <Users className="w-3.5 h-3.5 text-[#fe7e32]" />
                        {totalReviews} review{totalReviews === 1 ? '' : 's'}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {isAuthenticated ? (
                    hasUserReview ? (
                        <div className="bg-[#1a2232] border border-[#fe7e32]/30 rounded-xl p-5">
                            <p className="text-sm text-white font-semibold mb-1">
                                You already reviewed this movie.
                            </p>
                            <p className="text-xs text-[#9aa4b8]">
                                Remove your existing rating below if you would like to share an
                                update.
                            </p>
                            {manageFeedback && (
                                <div
                                    className={`mt-3 text-sm font-medium ${
                                        manageFeedback.type === 'success'
                                            ? 'text-emerald-400'
                                            : 'text-red-400'
                                    }`}
                                    role="status"
                                >
                                    {manageFeedback.message}
                                </div>
                            )}
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-[#1a2232] border border-white/10 rounded-xl p-5 space-y-4"
                        >
                            <div className="flex items-start gap-3">
                                <img
                                    src={account?.avatarUrl || '/default-avatar.jpg'}
                                    alt={account?.fullName || 'Your avatar'}
                                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                                />
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-sm text-white font-semibold">
                                            {account?.fullName || 'Movie Lover'}
                                        </p>
                                        <p className="text-xs text-[#9aa4b8]">
                                            Share your experience
                                        </p>
                                    </div>
                                    {renderInteractiveStars()}
                                    <textarea
                                        value={comment}
                                        onChange={(event) =>
                                            handleCommentChange(event.target.value)
                                        }
                                        placeholder="What did you think about this movie?"
                                        className="w-full min-h-[110px] bg-[#141a28] text-sm text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#fe7e32] placeholder:text-[#64748b]"
                                        maxLength={600}
                                    />
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        {feedback && (
                                            <span
                                                className={`text-sm font-medium ${
                                                    feedback.type === 'success'
                                                        ? 'text-emerald-400'
                                                        : 'text-red-400'
                                                }`}
                                                role="status"
                                            >
                                                {feedback.message}
                                            </span>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fe7e32] text-white rounded-lg font-semibold shadow-md shadow-[#fe7e32]/20 hover:bg-[#e56e29] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                            {isSubmitting ? 'Publishing...' : 'Post Review'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )
                ) : (
                    <div className="bg-[#1a2232] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-white font-semibold text-base">Share your voice</p>
                            <p className="text-sm text-[#9aa4b8]">
                                Sign in to leave a review and help other moviegoers.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignIn}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fe7e32] text-white rounded-lg font-semibold shadow-md shadow-[#fe7e32]/20 hover:bg-[#e56e29] transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Sign in to review
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-6 h-6 animate-spin text-[#fe7e32]" />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-10 bg-[#1a2232] border border-white/10 rounded-xl">
                            <p className="text-sm text-red-400">
                                {typeof error === 'object' &&
                                error &&
                                'message' in error &&
                                typeof (error as { message?: string }).message === 'string'
                                    ? (error as { message: string }).message
                                    : 'Unable to load reviews at the moment.'}
                            </p>
                        </div>
                    ) : displayReviews.length ? (
                        <div className="space-y-4">
                            {displayReviews.map((review, index) => {
                                const isOwner = account?.id === review.account.id
                                return (
                                    <div
                                        key={`${review.account.id}-${review.createdAt}-${index}`}
                                        className={`bg-[#1a2232] border rounded-xl p-5 ${
                                            isOwner
                                                ? 'border-[#fe7e32]/40 shadow-[0_0_0_1px_rgba(254,126,50,0.18)]'
                                                : 'border-white/10'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={
                                                        review.account.avatarUrl ||
                                                        '/default-avatar.jpg'
                                                    }
                                                    alt={
                                                        review.account.fullName || 'Reviewer avatar'
                                                    }
                                                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        {review.account.fullName || 'Movie Lover'}
                                                    </p>
                                                    <p className="text-xs text-[#9aa4b8]">
                                                        {formatReviewDate(review.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {renderStaticStars(review.rating)}
                                                <span className="text-xs text-[#9aa4b8]">
                                                    {review.rating.toFixed(1)} / 10
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed text-[#cccccc] whitespace-pre-line">
                                            {review.comment}
                                        </p>
                                        {isOwner && (
                                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-[#fe7e32]">
                                                    Your review
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleDeleteReview}
                                                    disabled={deleteReview.isPending}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-300 border border-red-400/40 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-60"
                                                >
                                                    {deleteReview.isPending ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <X className="w-3.5 h-3.5" />
                                                    )}
                                                    Remove review
                                                </button>
                                                {manageFeedback && (
                                                    <span
                                                        className={`text-xs font-medium ${
                                                            manageFeedback.type === 'success'
                                                                ? 'text-emerald-400'
                                                                : 'text-red-400'
                                                        }`}
                                                    >
                                                        {manageFeedback.message}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {hasNextPage && (
                                <div className="flex justify-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-sm text-white border border-white/20 rounded-lg hover:border-[#fe7e32] hover:text-[#fe7e32] transition-colors disabled:opacity-60"
                                    >
                                        {isFetchingNextPage && (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        )}
                                        {isFetchingNextPage ? 'Loading...' : 'Load more reviews'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-[#1a2232] border border-white/10 rounded-xl">
                            <p className="text-sm text-[#9aa4b8]">
                                No reviews yet. Be the first to share your thoughts!
                            </p>
                        </div>
                    )}
                </div>
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
                {similarMovies?.slice(0, 5).map((similar) => {
                    const ratingValue = similar.avgRating ?? similar.averageRating

                    return (
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
                                        {typeof ratingValue === 'number' ? (
                                            <>
                                                <Star className="w-3 h-3 text-yellow-400" />
                                                <span>{ratingValue.toFixed(1)} / 10</span>
                                            </>
                                        ) : (
                                            <span className="text-[#9aa4b8]">Not rated yet</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
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
    const {
        data: movieShowTimes = [],
        isLoading: movieShowTimesLoading,
        isError: movieShowTimesError,
        error: movieShowTimesErrorData
    } = useMovieShowTimes(movieId)
    const [showTrailer, setShowTrailer] = useState(false)

    // Scroll to top when component mounts to prevent auto-scroll to bottom
    useScrollToTop()

    const hasAvailableShowTimes = useMemo(() => {
        if (!Array.isArray(movieShowTimes)) return false

        return movieShowTimes.some(
            (day) =>
                Array.isArray(day?.times) &&
                day.times.some((time) => Boolean(time?.id && time?.time))
        )
    }, [movieShowTimes])

    const canSubmitReview = movieShowTimesError
        ? true
        : movieShowTimesLoading
          ? true
          : hasAvailableShowTimes

    const isUpcoming = !movieShowTimesLoading && !movieShowTimesError && !hasAvailableShowTimes
    const movieShowTimesErrorMessage = movieShowTimesError
        ? movieShowTimesErrorData &&
            typeof movieShowTimesErrorData === 'object' &&
            'message' in movieShowTimesErrorData &&
            typeof (movieShowTimesErrorData as { message?: string }).message === 'string'
            ? (movieShowTimesErrorData as { message: string }).message
            : undefined
        : undefined

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
                            <BookingSection
                                movieId={movieId}
                                isUpcoming={isUpcoming}
                                showTimesError={movieShowTimesError}
                                showTimesErrorMessage={movieShowTimesErrorMessage}
                            />
                            <ReviewsSection
                                movieId={movieId}
                                averageRating={movie.avgRating ?? movie.averageRating}
                                canSubmit={canSubmitReview}
                            />
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
