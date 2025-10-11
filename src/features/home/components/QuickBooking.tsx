import { Calendar, CheckCircle2, ChevronDown, Clock, Film, MapPin, Sparkles } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useBranches, useBranchMovies, useMovieShowTimes } from '../hooks/useBookingApi'

interface QuickBookingProps {
    movies: Array<{
        id: string
        title: string
        poster: string
        duration: number
        ageRating: string
    }>
}

const QuickBooking: React.FC<QuickBookingProps> = () => {
    const [selectedCinema, setSelectedCinema] = useState<string>('')
    const [selectedMovie, setSelectedMovie] = useState<string>('')
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectedShowtime, setSelectedShowtime] = useState<string>('')
    const [isBooking, setIsBooking] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    // API calls
    const { data: branches = [], isLoading: branchesLoading, error: branchesError } = useBranches()
    const { data: branchMovies = [], isLoading: moviesLoading } = useBranchMovies(selectedCinema)
    const { data: showTimeDays = [], isLoading: showTimesLoading } =
        useMovieShowTimes(selectedMovie)

    // Available dates from showtimes
    const availableDates = useMemo(() => {
        return showTimeDays.map((day) => ({
            value: day.dayOfWeek.value.split('T')[0],
            label: `${day.dayOfWeek.name}, ${new Date(day.dayOfWeek.value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`
        }))
    }, [showTimeDays])

    // Available showtimes for selected date
    const availableShowtimes = useMemo(() => {
        if (!selectedDate) return []

        const selectedDay = showTimeDays.find(
            (day) => day.dayOfWeek.value.split('T')[0] === selectedDate
        )

        return selectedDay?.times || []
    }, [showTimeDays, selectedDate])

    // Reset dependent fields when parent selection changes
    const handleCinemaChange = (value: string) => {
        setSelectedCinema(value)
        setSelectedMovie('')
        setSelectedDate('')
        setSelectedShowtime('')
    }

    const handleMovieChange = (value: string) => {
        setSelectedMovie(value)
        setSelectedDate('')
        setSelectedShowtime('')
    }

    const handleDateChange = (value: string) => {
        setSelectedDate(value)
        setSelectedShowtime('')
    }

    const handleBooking = async () => {
        if (!selectedCinema || !selectedMovie || !selectedDate || !selectedShowtime) {
            alert('Please select all fields!')
            return
        }

        setIsBooking(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        console.log('Booking:', {
            cinema: selectedCinema,
            movie: selectedMovie,
            date: selectedDate,
            showtime: selectedShowtime
        })

        setIsBooking(false)
    }

    const isFormComplete = selectedCinema && selectedMovie && selectedDate && selectedShowtime
    const completedSteps = [selectedCinema, selectedMovie, selectedDate, selectedShowtime].filter(
        Boolean
    ).length

    // Determine which steps to show on mobile
    const showCinemaStep = true
    const showMovieStep = selectedCinema
    const showDateStep = selectedCinema && selectedMovie
    const showShowtimeStep = selectedCinema && selectedMovie && selectedDate

    return (
        <div className="relative -mt-6 z-10">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Animated Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 via-blue-600/20 to-orange-600/20 rounded-2xl blur-2xl opacity-50 animate-pulse" />

                {/* Main Card */}
                <div className="relative bg-[#242b3d] rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-xl overflow-hidden">
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe7e32] via-[#648ddb] to-[#fe7e32]" />

                    {/* Floating Particles Effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-10 left-10 w-2 h-2 bg-[#fe7e32] rounded-full animate-ping opacity-20" />
                        <div
                            className="absolute top-20 right-20 w-2 h-2 bg-[#648ddb] rounded-full animate-ping opacity-20"
                            style={{ animationDelay: '1s' }}
                        />
                        <div
                            className="absolute bottom-20 left-1/4 w-2 h-2 bg-[#fe7e32] rounded-full animate-ping opacity-20"
                            style={{ animationDelay: '2s' }}
                        />
                    </div>

                    <div className="relative p-6 lg:p-8">
                        {/* Header - More Compact */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#fe7e32] to-[#648ddb] rounded-lg blur-md opacity-50 animate-pulse" />
                                    <div className="relative bg-gradient-to-r from-[#fe7e32] to-[#648ddb] p-2.5 rounded-lg">
                                        <Film className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-[#fe7e32] to-[#648ddb] bg-clip-text text-transparent">
                                        Quick Booking
                                    </h3>
                                    <p className="text-xs text-[#cccccc] mt-0.5">
                                        Select your preferred showtime
                                    </p>
                                </div>
                            </div>
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fe7e32]/10 to-[#648ddb]/10 rounded-full border border-[#fe7e32]/20">
                                <Sparkles className="w-4 h-4 text-[#fe7e32]" />
                                <span className="text-sm font-medium text-[#fe7e32]">
                                    Member Exclusive
                                </span>
                            </div>
                        </div>

                        {/* Selection Grid - Horizontal Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-5">
                            {/* Cinema Select */}
                            <div
                                className={`group relative transition-all duration-300 ${
                                    focusedField === 'cinema' ? 'scale-[1.02]' : ''
                                } ${!showCinemaStep ? 'hidden lg:block' : ''}`}
                                onFocus={() => setFocusedField('cinema')}
                                onBlur={() => setFocusedField(null)}
                            >
                                <label className="flex items-center gap-2 text-xs font-medium text-[#cccccc] mb-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#fe7e32]" />
                                    <span>
                                        <span className="lg:hidden">Step 1: </span>Cinema
                                    </span>
                                    {selectedCinema && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 animate-in fade-in zoom-in" />
                                    )}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedCinema}
                                        onChange={(e) => handleCinemaChange(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-[#1a2232] border border-gray-700 rounded-lg text-white text-sm appearance-none cursor-pointer transition-all duration-300 hover:border-[#fe7e32]/50 focus:border-[#fe7e32] focus:ring-2 focus:ring-[#fe7e32]/20 focus:outline-none"
                                    >
                                        <option value="" className="bg-[#1a2232]">
                                            {branchesLoading
                                                ? 'Loading cinemas...'
                                                : 'Select cinema...'}
                                        </option>
                                        {branchesError ? (
                                            <option value="" className="bg-[#1a2232] text-red-400">
                                                Error loading cinemas
                                            </option>
                                        ) : (
                                            branches.map((branch) => (
                                                <option
                                                    key={branch.id}
                                                    value={branch.id}
                                                    className="bg-[#1a2232]"
                                                >
                                                    {branch.name} - {branch.address}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:text-[#fe7e32]" />
                                    {selectedCinema && (
                                        <div className="absolute inset-0 border-2 border-[#fe7e32]/30 rounded-lg pointer-events-none animate-in fade-in" />
                                    )}
                                </div>
                            </div>

                            {/* Movie Select */}
                            <div
                                className={`group relative transition-all duration-300 ${
                                    focusedField === 'movie' ? 'scale-[1.02]' : ''
                                } ${!showMovieStep ? 'hidden lg:block' : ''}`}
                                onFocus={() => setFocusedField('movie')}
                                onBlur={() => setFocusedField(null)}
                            >
                                <label className="flex items-center gap-2 text-xs font-medium text-[#cccccc] mb-1.5">
                                    <Film className="w-3.5 h-3.5 text-[#648ddb]" />
                                    <span>
                                        <span className="lg:hidden">Step 2: </span>Movie
                                    </span>
                                    {selectedMovie && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 animate-in fade-in zoom-in" />
                                    )}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedMovie}
                                        onChange={(e) => handleMovieChange(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-[#1a2232] border border-gray-700 rounded-lg text-white text-sm appearance-none cursor-pointer transition-all duration-300 hover:border-[#648ddb]/50 focus:border-[#648ddb] focus:ring-2 focus:ring-[#648ddb]/20 focus:outline-none"
                                    >
                                        <option value="" className="bg-[#1a2232]">
                                            {moviesLoading
                                                ? 'Loading movies...'
                                                : 'Select movie...'}
                                        </option>
                                        {!selectedCinema ? (
                                            <option value="" className="bg-[#1a2232] text-gray-500">
                                                Please select cinema first
                                            </option>
                                        ) : (
                                            branchMovies.map((movie) => (
                                                <option
                                                    key={movie.id}
                                                    value={movie.id}
                                                    className="bg-[#1a2232]"
                                                >
                                                    {movie.name} ({movie.ageLimit}+)
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:text-[#648ddb]" />
                                    {selectedMovie && (
                                        <div className="absolute inset-0 border-2 border-[#648ddb]/30 rounded-lg pointer-events-none animate-in fade-in" />
                                    )}
                                </div>
                            </div>

                            {/* Date Select */}
                            <div
                                className={`group relative transition-all duration-300 ${
                                    focusedField === 'date' ? 'scale-[1.02]' : ''
                                } ${!showDateStep ? 'hidden lg:block' : ''}`}
                                onFocus={() => setFocusedField('date')}
                                onBlur={() => setFocusedField(null)}
                            >
                                <label className="flex items-center gap-2 text-xs font-medium text-[#cccccc] mb-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#fe7e32]" />
                                    <span>
                                        <span className="lg:hidden">Step 3: </span>Date
                                    </span>
                                    {selectedDate && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 animate-in fade-in zoom-in" />
                                    )}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-[#1a2232] border border-gray-700 rounded-lg text-white text-sm appearance-none cursor-pointer transition-all duration-300 hover:border-[#fe7e32]/50 focus:border-[#fe7e32] focus:ring-2 focus:ring-[#fe7e32]/20 focus:outline-none"
                                    >
                                        <option value="" className="bg-[#1a2232]">
                                            Select date...
                                        </option>
                                        {!selectedMovie ? (
                                            <option value="" className="bg-[#1a2232] text-gray-500">
                                                Please select movie first
                                            </option>
                                        ) : (
                                            availableDates.map((date) => (
                                                <option
                                                    key={date.value}
                                                    value={date.value}
                                                    className="bg-[#1a2232]"
                                                >
                                                    {date.label}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:text-[#fe7e32]" />
                                    {selectedDate && (
                                        <div className="absolute inset-0 border-2 border-[#fe7e32]/30 rounded-lg pointer-events-none animate-in fade-in" />
                                    )}
                                </div>
                            </div>

                            {/* Showtime Select */}
                            <div
                                className={`group relative transition-all duration-300 ${
                                    focusedField === 'showtime' ? 'scale-[1.02]' : ''
                                } ${!showShowtimeStep ? 'hidden lg:block' : ''}`}
                                onFocus={() => setFocusedField('showtime')}
                                onBlur={() => setFocusedField(null)}
                            >
                                <label className="flex items-center gap-2 text-xs font-medium text-[#cccccc] mb-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#648ddb]" />
                                    <span>
                                        <span className="lg:hidden">Step 4: </span>Showtime
                                    </span>
                                    {selectedShowtime && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 animate-in fade-in zoom-in" />
                                    )}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedShowtime}
                                        onChange={(e) => setSelectedShowtime(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-[#1a2232] border border-gray-700 rounded-lg text-white text-sm appearance-none cursor-pointer transition-all duration-300 hover:border-[#648ddb]/50 focus:border-[#648ddb] focus:ring-2 focus:ring-[#648ddb]/20 focus:outline-none"
                                    >
                                        <option value="" className="bg-[#1a2232]">
                                            {showTimesLoading
                                                ? 'Loading showtimes...'
                                                : 'Select showtime...'}
                                        </option>
                                        {!selectedDate ? (
                                            <option value="" className="bg-[#1a2232] text-gray-500">
                                                Please select date first
                                            </option>
                                        ) : (
                                            availableShowtimes.map((showtime) => (
                                                <option
                                                    key={showtime.id}
                                                    value={showtime.id}
                                                    className="bg-[#1a2232]"
                                                >
                                                    {showtime.time}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:text-[#648ddb]" />
                                    {selectedShowtime && (
                                        <div className="absolute inset-0 border-2 border-[#648ddb]/30 rounded-lg pointer-events-none animate-in fade-in" />
                                    )}
                                </div>
                            </div>

                            {/* Action Button - Last Column */}
                            <div
                                className={`flex flex-col justify-end ${!isFormComplete ? 'hidden lg:flex' : ''}`}
                            >
                                <button
                                    onClick={handleBooking}
                                    disabled={!isFormComplete || isBooking}
                                    className={`relative w-full py-2.5 px-4 rounded-lg font-bold text-sm overflow-hidden transition-all duration-300 ${
                                        isFormComplete && !isBooking
                                            ? 'bg-gradient-to-r from-[#fe7e32] to-[#648ddb] text-white shadow-lg shadow-[#fe7e32]/30 hover:shadow-xl hover:shadow-[#fe7e32]/40 hover:scale-[1.02] active:scale-[0.98]'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isBooking ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Film className="w-4 h-4" />
                                                <span>Book Now</span>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Compact Progress Indicator */}
                        <div className="mb-4">
                            <div className="h-1.5 bg-[#1a2232] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#fe7e32] to-[#648ddb] transition-all duration-500 ease-out"
                                    style={{ width: `${(completedSteps / 4) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickBooking
