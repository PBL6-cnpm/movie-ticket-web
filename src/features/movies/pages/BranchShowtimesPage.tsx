import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useBookingStore } from '@/features/movies/stores/booking.store'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Calendar, Clock, Film, Loader2, MapPin, Star, Ticket, Users } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import { useScrollToTop } from '../../../shared/hooks/useScrollToTop'
import {
    useBranchShowTimes,
    useBranches,
    type Branch,
    type BranchShowTimesItem
} from '../../home/hooks/useBookingApi'

const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (!hours) return `${mins}m`
    if (!mins) return `${hours}h`
    return `${hours}h ${mins}m`
}

const formatDayLabel = (name: string, value: string) => {
    const date = new Date(value)
    return `${name}, ${date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
    })}`
}

const BranchShowtimesPage: React.FC = () => {
    useScrollToTop()
    const { branchId } = useParams({ from: '/branches/$branchId/showtimes' })
    const navigate = useNavigate()
    const PAGE_SIZE = 6
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useBranchShowTimes(branchId, { pageSize: PAGE_SIZE })
    const { data: branches = [] } = useBranches()
    const { isAuthenticated } = useAuthStore()
    const { setBookingState } = useBookingStore()
    const loadingRef = useRef(false)

    const schedule = useMemo(() => {
        return data?.pages.flatMap((page) => page.items) ?? []
    }, [data])

    const totalAvailable = data?.pages?.[0]?.meta?.total ?? schedule.length
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    const requestNextPage = useCallback(() => {
        if (!hasNextPage || loadingRef.current) return
        loadingRef.current = true
        fetchNextPage()
            .catch(() => {
                // No-op: errors are surfaced via React Query state
            })
            .finally(() => {
                loadingRef.current = false
            })
    }, [fetchNextPage, hasNextPage])

    useEffect(() => {
        if (!hasNextPage) return

        const element = sentinelRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        requestNextPage()
                    }
                })
            },
            { rootMargin: '400px 0px' }
        )

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [hasNextPage, requestNextPage])

    useEffect(() => {
        if (isLoading) return
        if (!hasNextPage) return
        const pagesLoaded = data?.pages?.length ?? 0
        if (pagesLoaded === 1 && !isFetchingNextPage) {
            requestNextPage()
        }
    }, [data?.pages?.length, hasNextPage, isFetchingNextPage, isLoading, requestNextPage])

    const branchInfo = useMemo(() => {
        return branches?.find((branch: Branch) => branch.id === branchId)
    }, [branches, branchId])

    const pageTitle = branchInfo?.name || 'Selected Cinema'
    const hasShowtimes = totalAvailable > 0 || schedule.length > 0

    const handleShowtimeSelect = useCallback(
        (movieId: string, dateIso: string, showtimeId: string) => {
            const date = dateIso.split('T')[0]
            const payload = {
                branchId,
                movieId,
                date,
                showtimeId
            }

            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

            if (!isAuthenticated && !token) {
                setBookingState({ ...payload, redirectUrl: '/booking' })
                navigate({ to: '/login' })
                return
            }

            setBookingState(payload)
            navigate({ to: '/booking' })
        },
        [branchId, isAuthenticated, navigate, setBookingState]
    )

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="w-8 h-8 animate-spin text-[#fe7e32]" />
                    <p className="text-sm text-[#cccccc]">Fetching showtimes...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        const message =
            error instanceof Error
                ? error.message
                : 'Unable to load showtimes for this cinema right now.'
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <Ticket className="w-10 h-10 text-[#fe7e32] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Showtimes Unavailable</h2>
                    <p className="text-[#cccccc] mb-6">{message}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fe7e32] text-white rounded-lg font-medium hover:bg-[#e56e29] transition-all"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#1a2232] text-white">
                <div className="container mx-auto px-4 py-10 space-y-8">
                    <Breadcrumb
                        items={[
                            { label: 'Cinemas', path: '/movies' },
                            { label: pageTitle, isActive: true }
                        ]}
                    />

                    <div className="bg-[#242b3d] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <MapPin className="w-5 h-5 text-[#fe7e32]" />
                                    <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
                                </div>
                                <p className="text-sm text-[#9aa4b8] leading-relaxed max-w-2xl">
                                    {branchInfo?.address ||
                                        'Explore the latest showtimes currently available at this cinema.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-[#1a2232] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#cccccc]">
                                <Film className="w-5 h-5 text-[#648ddb]" />
                                <span>
                                    {hasShowtimes
                                        ? `${totalAvailable} movie${totalAvailable > 1 ? 's' : ''} playing`
                                        : 'No active screenings'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {!hasShowtimes ? (
                        <div className="bg-[#242b3d] border border-white/10 rounded-2xl p-10 text-center shadow-lg">
                            <Ticket className="w-12 h-12 text-[#fe7e32] mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No showtimes right now</h2>
                            <p className="text-sm text-[#9aa4b8] max-w-xl mx-auto">
                                This cinema currently has no scheduled screenings. Please check back
                                later or explore other cinemas for more options.
                            </p>
                            <Link
                                to="/movies"
                                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#fe7e32]/10 text-[#fe7e32] border border-[#fe7e32]/40 rounded-lg font-medium hover:bg-[#fe7e32]/20 hover:text-white transition-all"
                            >
                                Browse Movies
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {schedule.map((item: BranchShowTimesItem) => {
                                const ratingValue = item.movie.avgRating ?? item.movie.averageRating

                                return (
                                    <div
                                        key={item.movie.id}
                                        className="bg-[#242b3d] border border-white/5 rounded-2xl p-6 md:p-8 shadow-lg"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="w-full lg:w-52">
                                                <img
                                                    src={item.movie.poster}
                                                    alt={item.movie.name}
                                                    className="w-full h-72 object-cover rounded-xl shadow-lg"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-col gap-3">
                                                    <h2 className="text-2xl font-bold">
                                                        {item.movie.name}
                                                    </h2>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#9aa4b8]">
                                                        <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                                                            <Clock className="w-3.5 h-3.5 text-[#fe7e32]" />
                                                            {formatDuration(item.movie.duration)}
                                                        </span>
                                                        {typeof ratingValue === 'number' && (
                                                            <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                                                                <Star className="w-3.5 h-3.5 text-yellow-400" />
                                                                {ratingValue.toFixed(1)} / 10
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                                                            <Users className="w-3.5 h-3.5 text-[#fe7e32]" />
                                                            T{item.movie.ageLimit}+
                                                        </span>
                                                        {item.movie.genres
                                                            ?.slice(0, 3)
                                                            .map((genre) => (
                                                                <span
                                                                    key={genre.id}
                                                                    className="inline-flex items-center gap-1 rounded-full bg-[#1a2232] border border-white/10 px-3 py-1"
                                                                >
                                                                    {genre.name}
                                                                </span>
                                                            ))}
                                                    </div>
                                                    {item.movie.description && (
                                                        <p className="text-sm text-[#cccccc] leading-relaxed line-clamp-3">
                                                            {item.movie.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {item.showTimes.map((day) => (
                                                        <div
                                                            key={`${day.dayOfWeek.value}-${item.movie.id}`}
                                                            className="border border-white/5 rounded-xl p-4 bg-[#1e2538]"
                                                        >
                                                            <div className="flex items-center gap-2 text-[#fe7e32] font-semibold">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    {formatDayLabel(
                                                                        day.dayOfWeek.name,
                                                                        day.dayOfWeek.value
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {day.times.map((time) => (
                                                                    <button
                                                                        key={time.id}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleShowtimeSelect(
                                                                                item.movie.id,
                                                                                day.dayOfWeek.value,
                                                                                time.id
                                                                            )
                                                                        }
                                                                        className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[#242b3d] border border-[#fe7e32]/30 text-sm text-white hover:border-[#fe7e32] hover:bg-[#fe7e32]/10 transition-colors"
                                                                    >
                                                                        <span className="font-medium">
                                                                            {time.time}
                                                                        </span>
                                                                        {typeof time.availableSeats ===
                                                                            'number' &&
                                                                            typeof time.totalSeats ===
                                                                                'number' && (
                                                                                <span className="text-xs text-[#9aa4b8]">
                                                                                    {
                                                                                        time.availableSeats
                                                                                    }
                                                                                    /
                                                                                    {
                                                                                        time.totalSeats
                                                                                    }{' '}
                                                                                    seats
                                                                                </span>
                                                                            )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-wrap gap-3 pt-2">
                                                    <Link
                                                        to="/movie/$movieId"
                                                        params={{ movieId: item.movie.id }}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fe7e32] text-white rounded-lg font-medium hover:bg-[#e56e29] transition-all"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={sentinelRef} />
                            {hasNextPage && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="button"
                                        onClick={requestNextPage}
                                        disabled={isFetchingNextPage}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-sm text-white border border-white/20 rounded-lg hover:border-[#fe7e32] hover:text-[#fe7e32] transition-colors disabled:opacity-60"
                                    >
                                        {isFetchingNextPage ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Loading more...
                                            </>
                                        ) : (
                                            'Load more showtimes'
                                        )}
                                    </button>
                                </div>
                            )}
                            {isFetchingNextPage && !hasNextPage && (
                                <div className="flex justify-center pt-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-[#fe7e32]" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}

export default BranchShowtimesPage
