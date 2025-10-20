import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Clock, Minus, Plus, Users } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useMovieShowTimes } from '../../home/hooks/useBookingApi'
import SeatSelection from '../components/SeatSelection'
import { useMovieDetail } from '../hooks/useMovieDetail'
import { useRefreshments } from '../hooks/useRefreshments'
import { useSelectedSeatsInfo } from '../hooks/useSelectedSeatsInfo'
import type { SelectedRefreshment } from '../types/refreshment.types'

interface BookingPageProps {
    movieId: string
    showtimeId: string
}

const BookingPage: React.FC<BookingPageProps> = ({ movieId, showtimeId }) => {
    const navigate = useNavigate()

    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [selectedRefreshments, setSelectedRefreshments] = useState<SelectedRefreshment[]>([])

    // Fetch movie details
    const { data: movie, isLoading: movieLoading } = useMovieDetail(movieId)
    const { data: showTimes = [] } = useMovieShowTimes(movieId)
    const { data: refreshmentsData, isLoading: refreshmentsLoading } = useRefreshments()
    const { totalCost: seatsTotalCost, selectedSeatsInfo } = useSelectedSeatsInfo(
        showtimeId,
        selectedSeats
    )

    // Calculate total cost including refreshments
    const refreshmentsTotalCost = useMemo(() => {
        return selectedRefreshments.reduce((total, item) => {
            return total + item.refreshment.price * item.quantity
        }, 0)
    }, [selectedRefreshments])

    const totalCost = seatsTotalCost + refreshmentsTotalCost

    // Find current showtime details
    const currentShowtime = showTimes
        .flatMap((day) => day.times)
        .find((time) => time.id === showtimeId)

    const handleSeatSelect = (seatName: string) => {
        setSelectedSeats((prev) =>
            prev.includes(seatName) ? prev.filter((s) => s !== seatName) : [...prev, seatName]
        )
    }

    const handleRefreshmentQuantityChange = (refreshmentId: string, change: number) => {
        setSelectedRefreshments((prev) => {
            const existingIndex = prev.findIndex((item) => item.refreshment.id === refreshmentId)

            if (existingIndex >= 0) {
                const newQuantity = prev[existingIndex].quantity + change
                if (newQuantity <= 0) {
                    return prev.filter((_, index) => index !== existingIndex)
                }
                return prev.map((item, index) =>
                    index === existingIndex ? { ...item, quantity: newQuantity } : item
                )
            } else if (change > 0 && refreshmentsData) {
                const refreshment = refreshmentsData.items.find((r) => r.id === refreshmentId)
                if (refreshment) {
                    return [...prev, { refreshment, quantity: change }]
                }
            }
            return prev
        })
    }

    const handleBookingConfirm = () => {
        if (selectedSeats.length === 0) return

        // Log booking details
        console.log('🎫 BOOKING CONFIRMED:', {
            movieId,
            movieName: movie?.name,
            showtimeId,
            showtimeTime: currentShowtime?.time,
            selectedSeats,
            selectedSeatsInfo,
            selectedRefreshments,
            seatsTotalCost,
            refreshmentsTotalCost,
            totalCost
        })

        // Build confirmation message
        let confirmMessage = `Đặt vé thành công!\nPhim: ${movie?.name}\nSuất chiếu: ${currentShowtime?.time}\nGhế: ${selectedSeats.join(', ')}`

        if (selectedRefreshments.length > 0) {
            confirmMessage += '\n\nĐồ ăn & thức uống:'
            selectedRefreshments.forEach((item) => {
                confirmMessage += `\n- ${item.refreshment.name} x${item.quantity}: ${(item.refreshment.price * item.quantity).toLocaleString('vi-VN')} VNĐ`
            })
        }

        confirmMessage += `\n\nTổng tiền: ${totalCost.toLocaleString('vi-VN')} VNĐ`

        // TODO: Implement actual booking API call
        alert(confirmMessage)
    }

    if (movieLoading) {
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center">
                <div className="text-white">Đang tải...</div>
            </div>
        )
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#1a2232] flex items-center justify-center">
                <div className="text-white">Không tìm thấy phim</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1a2232] text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#1a2232]/95 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate({ to: '/movies' })}
                            className="flex items-center gap-2 text-white hover:text-[#fe7e32] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Quay lại
                        </button>
                        <h1 className="text-xl font-bold">Book Ticket</h1>
                        <div className="w-20" /> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Movie Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#242b3d] rounded-2xl p-6 sticky top-24">
                            <div className="flex items-start gap-4 mb-6">
                                <img
                                    src={movie.poster}
                                    alt={movie.name}
                                    className="w-20 h-28 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-white mb-2">
                                        {movie.name}
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-[#cccccc]">
                                            <Clock className="w-4 h-4" />
                                            {Math.floor(movie.duration / 60)}h {movie.duration % 60}
                                            m
                                        </div>
                                        <div className="flex items-center gap-2 text-[#cccccc]">
                                            <Users className="w-4 h-4" />T{movie.ageLimit}+
                                        </div>
                                        {currentShowtime && (
                                            <div className="flex items-center gap-2 text-[#fe7e32]">
                                                <Calendar className="w-4 h-4" />
                                                <span>Showtime: {currentShowtime.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Selected Seats Summary */}
                            {selectedSeats.length > 0 && (
                                <div className="border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-semibold text-[#fe7e32] mb-3">
                                        Selected Seats ({selectedSeats.length})
                                    </h3>
                                    <div className="space-y-2 mb-4">
                                        {selectedSeatsInfo.map((seat) => (
                                            <div
                                                key={seat.name}
                                                className="flex justify-between items-center text-sm"
                                            >
                                                <span className="text-white">{seat.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#cccccc]">
                                                        {seat.type.name}
                                                    </span>
                                                    <span className="text-[#fe7e32] font-medium">
                                                        {seat.type.price.toLocaleString('vi-VN')} đ
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected Refreshments Summary */}
                            {selectedRefreshments.length > 0 && (
                                <div className="border-t border-white/10 pt-6">
                                    <h3 className="text-sm font-semibold text-[#fe7e32] mb-3">
                                        Refreshments ({selectedRefreshments.length})
                                    </h3>
                                    <div className="space-y-2 mb-4">
                                        {selectedRefreshments.map((item) => (
                                            <div
                                                key={item.refreshment.id}
                                                className="flex justify-between items-center text-sm"
                                            >
                                                <span className="text-white">
                                                    {item.refreshment.name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#cccccc]">
                                                        x{item.quantity}
                                                    </span>
                                                    <span className="text-[#fe7e32] font-medium">
                                                        {(
                                                            item.refreshment.price * item.quantity
                                                        ).toLocaleString('vi-VN')}{' '}
                                                        đ
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total Summary */}
                            {(selectedSeats.length > 0 || selectedRefreshments.length > 0) && (
                                <div className="border-t border-white/10 pt-3">
                                    {selectedSeats.length > 0 && (
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-[#cccccc]">Movie Tickets:</span>
                                            <span className="text-white">
                                                {seatsTotalCost.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    )}
                                    {selectedRefreshments.length > 0 && (
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-[#cccccc]">Refreshments:</span>
                                            <span className="text-white">
                                                {refreshmentsTotalCost.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-white">Total:</span>
                                        <span className="text-xl font-bold text-[#fe7e32]">
                                            {totalCost.toLocaleString('vi-VN')} đ
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Booking Button */}
                            <button
                                onClick={handleBookingConfirm}
                                disabled={selectedSeats.length === 0}
                                className="w-full mt-6 bg-[#fe7e32] hover:bg-[#e56e29] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
                            >
                                {selectedSeats.length > 0
                                    ? `Book ${selectedSeats.length} Tickets`
                                    : 'Please select seats'}
                            </button>
                        </div>
                    </div>

                    {/* Main Content - Seat Selection and Refreshments */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Seat Selection */}
                        <SeatSelection
                            showtimeId={showtimeId}
                            selectedSeats={selectedSeats}
                            onSeatSelect={handleSeatSelect}
                        />

                        {/* Refreshments Section */}
                        <div className="bg-[#242b3d] rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Refreshments</h3>

                            {refreshmentsLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fe7e32] mx-auto"></div>
                                    <p className="text-[#cccccc] mt-2">Loading...</p>
                                </div>
                            ) : refreshmentsData?.items.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {refreshmentsData.items.map((refreshment) => {
                                        const selectedItem = selectedRefreshments.find(
                                            (item) => item.refreshment.id === refreshment.id
                                        )
                                        const quantity = selectedItem?.quantity || 0

                                        return (
                                            <div
                                                key={refreshment.id}
                                                className="bg-[#1a2232] rounded-lg p-4 hover:bg-[#1a2232]/80 transition-colors"
                                            >
                                                <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                                                    <img
                                                        src={refreshment.picture}
                                                        alt={refreshment.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h4 className="text-white font-medium mb-2 text-sm">
                                                    {refreshment.name}
                                                </h4>
                                                <p className="text-[#fe7e32] font-bold mb-3">
                                                    {refreshment.price.toLocaleString('vi-VN')} đ
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleRefreshmentQuantityChange(
                                                                    refreshment.id,
                                                                    -1
                                                                )
                                                            }
                                                            disabled={quantity === 0}
                                                            className="w-8 h-8 rounded-full bg-[#fe7e32] hover:bg-[#e56e29] disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4 text-white" />
                                                        </button>
                                                        <span className="text-white font-medium w-8 text-center">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleRefreshmentQuantityChange(
                                                                    refreshment.id,
                                                                    1
                                                                )
                                                            }
                                                            className="w-8 h-8 rounded-full bg-[#fe7e32] hover:bg-[#e56e29] flex items-center justify-center transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>

                                                    {quantity > 0 && (
                                                        <div className="text-right">
                                                            <p className="text-xs text-[#cccccc]">
                                                                Total
                                                            </p>
                                                            <p className="text-[#fe7e32] font-bold text-sm">
                                                                {(
                                                                    refreshment.price * quantity
                                                                ).toLocaleString('vi-VN')}{' '}
                                                                đ
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-[#cccccc]">No Refreshments</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingPage
