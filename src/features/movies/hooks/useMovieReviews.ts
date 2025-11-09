import { apiClient } from '@/shared/api/api-client'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReviewItem, ReviewsResponse } from '../types/review.types'

const REVIEWS_PAGE_SIZE = 5

interface ReviewsPage {
    items: ReviewItem[]
    meta: ReviewsResponse['meta']
    nextOffset: number
}

interface UseMovieReviewsOptions {
    pageSize?: number
    enabled?: boolean
}

export const useMovieReviews = (
    movieId: string,
    options: UseMovieReviewsOptions = {}
) => {
    const pageSize = options.pageSize ?? REVIEWS_PAGE_SIZE
    const enabled = options.enabled ?? true

    return useInfiniteQuery<ReviewsPage>({
        queryKey: ['movie', 'reviews', movieId, pageSize],
        enabled: Boolean(movieId) && enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const response = await apiClient.get<{ data: ReviewsResponse }>(
                `/reviews/all/movies/${movieId}`,
                {
                    params: {
                        limit: pageSize,
                        offset: pageParam
                    }
                }
            )

            const payload = response.data?.data

            if (!payload) {
                throw new Error('Failed to load reviews.')
            }

            const nextOffset = (payload.meta?.offset ?? 0) + payload.items.length

            return {
                items: payload.items ?? [],
                meta: payload.meta,
                nextOffset
            }
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta) return undefined

            const reachedEnd =
                lastPage.meta.offset + lastPage.items.length >= (lastPage.meta.total ?? 0)

            if (reachedEnd) {
                return undefined
            }

            return lastPage.nextOffset
        }
    })
}

interface CreateReviewPayload {
    rating: number
    comment: string
}

export const useCreateReview = (movieId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: CreateReviewPayload) => {
            const response = await apiClient.post<{ data: ReviewItem }>(`/reviews`, {
                ...payload,
                movieId
            })

            if (!response.data?.data) {
                throw new Error('Failed to submit review.')
            }

            return response.data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movie', 'reviews', movieId] })
            queryClient.invalidateQueries({ queryKey: ['movie', 'detail', movieId] })
        }
    })
}

export const useDeleteReview = (movieId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (reviewId?: string) => {
            const endpoint = reviewId ? `/reviews/${reviewId}` : `/reviews/movies/${movieId}`
            const response = await apiClient.delete(endpoint)
            return response.data?.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movie', 'reviews', movieId] })
            queryClient.invalidateQueries({ queryKey: ['movie', 'detail', movieId] })
            queryClient.invalidateQueries({ queryKey: ['reviews', 'me'] })
        }
    })
}

export const useDeleteReviewByMovie = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (movieId: string) => {
            const response = await apiClient.delete(`/reviews/movies/${movieId}`)
            return response.data?.data
        },
        onSuccess: (_data, movieId) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', 'me'] })
            queryClient.invalidateQueries({ queryKey: ['movie', 'reviews', movieId] })
            queryClient.invalidateQueries({ queryKey: ['movie', 'detail', movieId] })
        }
    })
}

export const useMyReviews = () => {
    return useQuery({
        queryKey: ['reviews', 'me'],
        queryFn: async () => {
            const response = await apiClient.get<{ data: ReviewItem[] }>('/reviews/me')
            return response.data?.data ?? []
        },
        staleTime: 2 * 60 * 1000
    })
}
