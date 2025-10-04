import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/api/api-client'

export interface MoviePreview {
    id: string
    name: string
    description: string
    duration: number
    ageLimit: number
    director: string
    trailer: string
    poster: string
    releaseDate: string
    genres: Array<{
        id: string
        name: string
    }>
    actors: Array<{
        id: string
        name: string
        picture: string
    }>
    createdAt: string
    updatedAt: string
}

export const useMoviePreview = (movieId: string, enabled: boolean) => {
    return useQuery<MoviePreview>({
        queryKey: ['movie-preview', movieId],
        queryFn: async () => {
            const response = await apiClient.get(`/movies/${movieId}`)
            return response.data.data
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000 // 10 minutes
    })
}
