import React, { useState } from 'react'
import Breadcrumb from '../../../shared/components/navigation/Breadcrumb'
import PageTransition from '../../../shared/components/ui/PageTransition'
import MoviesFilter from '../components/MoviesFilter'
import MoviesGrid from '../components/MoviesGrid'
import { useMovies } from '../hooks/useMovies'

export interface MoviesFilterState {
    genres: string[]
    year: string
    rating: string
    sortBy: 'name' | 'releaseDate' | 'rating'
    sortOrder: 'asc' | 'desc'
}

const MoviesPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState<MoviesFilterState>({
        genres: [],
        year: '',
        rating: '',
        sortBy: 'releaseDate',
        sortOrder: 'desc'
    })

    const limit = 20
    const offset = (currentPage - 1) * limit

    const {
        data: moviesData,
        isLoading,
        error
    } = useMovies({
        limit,
        offset,
        genres: filters.genres.join(','),
        year: filters.year,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
    })

    const movies = moviesData?.movies || []
    const totalPages = moviesData?.totalPages || 0

    const handleFilterChange = (newFilters: MoviesFilterState) => {
        setFilters(newFilters)
        setCurrentPage(1) // Reset to first page when filters change
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-brand">
                <div className="container-custom py-8">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: 'Home', path: '/' },
                            { label: 'Movies', isActive: true }
                        ]}
                    />

                    {/* Movies Layout - 25% Sidebar / 75% Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar - Filters (25% = 3/12 columns) */}
                        <div className="lg:col-span-3">
                            <div className="lg:sticky lg:top-24">
                                <MoviesFilter
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        {/* Right Content - Movies Grid (75% = 9/12 columns) */}
                        <div className="lg:col-span-9">
                            <MoviesGrid
                                movies={movies}
                                isLoading={isLoading}
                                error={error}
                                currentPage={currentPage}
                                totalCount={moviesData?.totalCount || 0}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default MoviesPage
