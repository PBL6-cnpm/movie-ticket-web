import { useDeleteReviewByMovie, useMyReviews } from '@/features/movies/hooks/useMovieReviews'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, MessageCircle, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

const formatReviewDate = (value: string) =>
    new Date(value).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

interface FeedbackState {
    movieId: string
    type: 'success' | 'error'
    message: string
}

const MyReviewsPage = () => {
    const navigate = useNavigate()
    const { data: reviews = [], isLoading, isError, error, refetch } = useMyReviews()
    const deleteReview = useDeleteReviewByMovie()
    const [feedback, setFeedback] = useState<FeedbackState | null>(null)

    const sortedReviews = useMemo(
        () =>
            [...reviews].sort(
                (a, b) =>
                    new Date(b.updatedAt || b.createdAt).getTime() -
                    new Date(a.updatedAt || a.createdAt).getTime()
            ),
        [reviews]
    )

    const handleRemove = (movieId: string) => {
        setFeedback(null)
        deleteReview.mutate(movieId, {
            onSuccess: () => {
                setFeedback({ movieId, type: 'success', message: 'Review removed successfully.' })
            },
            onError: (mutationError) => {
                let message = 'Could not remove this review. Please try again.'
                if (
                    mutationError &&
                    typeof mutationError === 'object' &&
                    'message' in mutationError &&
                    typeof (mutationError as { message?: string }).message === 'string'
                ) {
                    message = (mutationError as { message: string }).message || message
                }
                setFeedback({ movieId, type: 'error', message })
            }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center text-white">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-[#fe7e32]" />
                    Loading your ratings...
                </div>
            </div>
        )
    }

    if (isError) {
        const message =
            error &&
            typeof error === 'object' &&
            'message' in error &&
            typeof (error as { message?: string }).message === 'string'
                ? (error as { message: string }).message
                : 'Unable to load your reviews right now.'

        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center text-white">
                <div className="text-center max-w-md space-y-4">
                    <MessageCircle className="w-10 h-10 mx-auto text-[#fe7e32]" />
                    <p className="text-sm text-[#cccccc]">{message}</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="px-5 py-2.5 bg-[#fe7e32] text-white rounded-lg font-semibold hover:bg-[#e56e29] transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1a2232] text-white">
            <div className="container-custom py-8 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">My Ratings</h1>
                    <p className="text-sm text-[#9aa4b8]">
                        Track every movie you have rated and update your thoughts anytime.
                    </p>
                </div>

                {sortedReviews.length === 0 ? (
                    <div className="bg-[#242b3d] border border-white/10 rounded-2xl p-10 text-center space-y-4">
                        <MessageCircle className="w-10 h-10 text-[#fe7e32] mx-auto" />
                        <h2 className="text-xl font-semibold">No reviews yet</h2>
                        <p className="text-sm text-[#9aa4b8]">
                            Ready to share your first impression? Find a movie and let others know
                            what you think.
                        </p>
                        <Link
                            to="/movies"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fe7e32] text-white rounded-lg font-semibold hover:bg-[#e56e29] transition-colors"
                        >
                            Browse movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {sortedReviews.map((review) => {
                            const isProcessing =
                                deleteReview.isPending && deleteReview.variables === review.movieId

                            return (
                                <div
                                    key={`${review.movieId}-${review.createdAt}`}
                                    className="bg-[#242b3d] border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-[#9aa4b8]">
                                                <MessageCircle className="w-4 h-4 text-[#fe7e32]" />
                                                <span>
                                                    Rated on{' '}
                                                    {formatReviewDate(
                                                        review.updatedAt || review.createdAt
                                                    )}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold mt-2">
                                                {review.comment || 'No comment provided'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#fe7e32] font-semibold">
                                            <Star className="w-5 h-5 text-yellow-400" />
                                            <span>{review.rating.toFixed(1)} / 10</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate({
                                                    to: '/movie/$movieId',
                                                    params: { movieId: review.movieId }
                                                })
                                            }
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2232] border border-white/10 text-sm rounded-lg hover:border-[#fe7e32] hover:text-[#fe7e32] transition-colors"
                                        >
                                            View movie
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(review.movieId)}
                                            disabled={isProcessing}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-sm text-red-300 border border-red-500/40 rounded-lg hover:bg-red-500/15 transition-colors disabled:opacity-60"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                            Remove rating
                                        </button>
                                        {feedback && feedback.movieId === review.movieId && (
                                            <span
                                                className={`text-sm font-medium ${
                                                    feedback.type === 'success'
                                                        ? 'text-emerald-400'
                                                        : 'text-red-400'
                                                }`}
                                            >
                                                {feedback.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyReviewsPage
