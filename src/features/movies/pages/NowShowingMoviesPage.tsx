import { apiClient } from '@/shared/api/api-client'
import Breadcrumb from '@/shared/components/navigation/Breadcrumb'
import PageTransition from '@/shared/components/ui/PageTransition'
import type { Movie as UIMovie } from '@/shared/data/mockMovies'
import type { ApiListResponse, Movie as ApiMovie } from '@/shared/types/movies.types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import MovieCard from '../../home/components/MovieCard'

const movieMapper = (movie: ApiMovie): UIMovie => {
    const rating =
        typeof movie.averageRating === 'number'
            ? movie.averageRating
            : typeof (movie as unknown as { avgRating?: number }).avgRating === 'number'
              ? (movie as unknown as { avgRating?: number }).avgRating
              : null

    return {
        id: movie.id,
        title: movie.name,
        poster: movie.poster,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        ageRating: `T${movie.ageLimit}`,
        rating,
        genres: movie?.genres?.map((g) => g.name) ?? [],
        description: movie.description || '',
        actors: movie.actors?.map((actor) => actor.name) ?? [],
        director: movie.director || '',
        status: movie.status ?? 'unknown'
    }
}

const fetchNowShowingMovies = async ({ pageParam = 0 }) => {
    const response = await apiClient.get<ApiListResponse<ApiMovie>>(
        `/movies/now-showing?limit=12&offset=${pageParam}`
    )
    if (response.data.success && response.data.data?.items) {
        return {
            movies: response.data.data.items.map(movieMapper),
            nextOffset: response.data.data.items.length > 0 ? pageParam + 12 : undefined
        }
    }
    throw new Error('Failed to fetch now showing movies')
}

const NowShowingMoviesPage = () => {
    const { ref, inView } = useInView()

    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ['nowShowingMoviesPage'], // Use a unique key for the page query
            queryFn: fetchNowShowingMovies,
            initialPageParam: 0,
            getNextPageParam: (lastPage) => lastPage.nextOffset
        })

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage])

    const movies = data?.pages.flatMap((page) => page.movies) || []

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#1a2232] text-white">
                <div className="container-custom py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Movies', path: '/' },
                            { label: 'Now Showing', isActive: true }
                        ]}
                    />
                    <div className="flex items-center justify-between mt-6 mb-8">
                        <h1 className="text-4xl font-bold">Now Showing Movies</h1>
                    </div>

                    {status === 'pending' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
                                ></div>
                            ))}
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-20">
                            <p className="text-red-500">Error: {error.message}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                                {movies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                            <div ref={ref} className="h-10 mt-10 flex justify-center">
                                {isFetchingNextPage && (
                                    <div className="w-8 h-8 border-4 border-[#fe7e32] border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {!hasNextPage && movies.length > 0 && (
                                    <p className="text-gray-500">You've reached the end.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}

export default NowShowingMoviesPage
