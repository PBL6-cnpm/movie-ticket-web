import api from '@/lib/api'
import type { ApiMovie } from '@/shared/types/api-movie.types'
import type { MovieDetailResponse } from '@/shared/types/movies.types'
import { useQuery } from '@tanstack/react-query'

export const useMovieDetail = (movieId: string) => {
    return useQuery({
        queryKey: ['movie', 'detail', movieId],
        queryFn: async () => {
            const response = await api.get<MovieDetailResponse>(`/movies/${movieId}`)
            return response.data.data
        },
        enabled: !!movieId,
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
}

export const useSimilarMovies = (genres: string[], currentMovieId: string) => {
    return useQuery({
        queryKey: ['movies', 'similar', genres.join(','), currentMovieId],
        queryFn: async () => {
            const response = await api.get<{ data: { items: ApiMovie[] } }>('/movies', {
                params: {
                    limit: 8,
                    offset: 0,
                    genres: genres.join(',')
                }
            })
            // Filter out the current movie from similar movies
            return response.data.data.items.filter((movie: ApiMovie) => movie.id !== currentMovieId)
        },
        enabled: genres.length > 0,
        staleTime: 10 * 60 * 1000 // 10 minutes
    })
}
