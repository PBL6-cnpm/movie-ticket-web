import { apiClient } from '@/shared/api/api-client';
import type { ApiListResponse, Movie as ApiMovie } from '@/shared/types/movies.types';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Search, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

const searchMovies = async (query: string): Promise<ApiMovie[]> => {
    if (!query) return [];
    const response = await apiClient.get<ApiListResponse<ApiMovie>>(
        `/movies/search/by-name-movie?name=${query}&limit=5&offset=0`
    );
    if (response.data.success) {
        return response.data.data.items;
    }
    throw new Error('Failed to search movies');
};

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    const { data: results, isLoading } = useQuery({
        queryKey: ['movieSearch', debouncedQuery],
        queryFn: () => searchMovies(debouncedQuery),
        enabled: !!debouncedQuery,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showResults = isFocused && (query.length > 0);

    return (
        <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md" ref={searchRef}>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search for movies..."
                    className="bg-[#242b3d] border border-gray-700 rounded-full w-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#fe7e32] transition-all duration-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                {isLoading && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 animate-spin" />
                )}
            </div>

            {showResults && (
                <div className="absolute top-full mt-2 w-full bg-[#242b3d] rounded-lg shadow-xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95">
                    {results && results.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                            {results.map(movie => (
                                <Link 
                                    key={movie.id} 
                                    to="/movie/$movieId" 
                                    params={{ movieId: movie.id }}
                                    className="flex items-center gap-4 p-3 hover:bg-[#1a2232] transition-colors"
                                    onClick={() => setIsFocused(false)}
                                >
                                    <img src={movie.poster} alt={movie.name} className="w-12 h-16 object-cover rounded-md" />
                                    <div>
                                        <p className="font-semibold text-white line-clamp-1">{movie.name}</p>
                                        <p className="text-xs text-gray-400">{movie.duration} min</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : !isLoading && (
                        <div className="p-4 text-center text-sm text-gray-400">
                            No results found for "{debouncedQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
