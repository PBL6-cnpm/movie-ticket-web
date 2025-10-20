import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/api/api-client'

interface Branch {
    id: string
    name: string
    address: string
    createdAt: string
    updatedAt: string
}

interface BranchesResponse {
    success: boolean
    statusCode: number
    message: string
    code: string
    data: Branch[]
}

interface BranchMovie {
    id: string
    name: string
    description: string
    duration: number
    ageLimit: number
    director: string
    trailer: string
    poster: string
    releaseDate: string
    screeningStart: string
    screeningEnd: string
    genres: Array<{ id: string; name: string }>
    actors: Array<{ id: string; name: string }>
    createdAt: string
    updatedAt: string
}

interface BranchMoviesResponse {
    success: boolean
    statusCode: number
    message: string
    code: string
    data: {
        items: BranchMovie[]
    }
}

interface ShowTime {
    id: string
    time: string
}

interface ShowTimeDay {
    dayOfWeek: {
        name: string
        value: string
    }
    times: ShowTime[]
}

interface ShowTimesResponse {
    success: boolean
    statusCode: number
    message: string
    code: string
    data: {
        items: ShowTimeDay[]
    }
}

const fetchBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get<BranchesResponse>('/branches')

    if (response.data.success && response.data.data) {
        return response.data.data
    }

    console.error('❌ API DEBUG - Failed to fetch branches:', response.data)
    throw new Error('Failed to fetch branches')
}

const fetchBranchMovies = async (branchId: string): Promise<BranchMovie[]> => {
    const response = await apiClient.get<BranchMoviesResponse>(
        `/movies/get-with-branches/${branchId}`
    )

    if (response.data.success && response.data.data?.items) {
        return response.data.data.items
    }

    throw new Error('Failed to fetch branch movies')
}

const fetchMovieShowTimes = async (movieId: string): Promise<ShowTimeDay[]> => {
    const response = await apiClient.get<ShowTimesResponse>(`/show-time/get-with-movie/${movieId}`)

    if (response.data.success && response.data.data?.items) {
        return response.data.data.items
    }

    console.error('❌ API DEBUG - Failed to fetch showtimes:', response.data)
    throw new Error('Failed to fetch movie showtimes')
}

const fetchBranchMovieShowTimes = async (
    movieId: string,
    branchId: string
): Promise<ShowTimeDay[]> => {
    const response = await apiClient.get<ShowTimesResponse>(
        `/show-time/get-with-branch?movieId=${movieId}&branchId=${branchId}`
    )

    if (response.data.success && response.data.data?.items) {
        return response.data.data.items
    }

    console.error('❌ API DEBUG - Failed to fetch branch showtimes:', response.data)
    throw new Error('Failed to fetch branch movie showtimes')
}

export const useBranches = () => {
    return useQuery({
        queryKey: ['branches'],
        queryFn: fetchBranches,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000 // 10 minutes
    })
}

export const useBranchMovies = (branchId: string) => {
    return useQuery({
        queryKey: ['branchMovies', branchId],
        queryFn: () => fetchBranchMovies(branchId),
        enabled: !!branchId,
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 5 * 60 * 1000 // 5 minutes
    })
}

export const useMovieShowTimes = (movieId: string) => {
    return useQuery({
        queryKey: ['movieShowTimes', movieId],
        queryFn: () => fetchMovieShowTimes(movieId),
        enabled: !!movieId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000 // 5 minutes
    })
}

export const useBranchMovieShowTimes = (movieId: string, branchId: string) => {
    return useQuery({
        queryKey: ['branchMovieShowTimes', movieId, branchId],
        queryFn: () => fetchBranchMovieShowTimes(movieId, branchId),
        enabled: !!movieId && !!branchId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000 // 5 minutes
    })
}

export type { Branch, BranchMovie, ShowTime, ShowTimeDay }
