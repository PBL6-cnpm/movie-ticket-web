import ProtectedRoute from '@/features/auth/routes/ProtectedRoute'
import { useEffect, useState } from 'react'
import { useBooking, type BookingData } from '../hooks/useBooking'
import { Armchair, Calendar, CheckCircle, MapPin, Popcorn, X, XCircle } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void, isLoading: boolean }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="
                    w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                    bg-[#242b3d] border-[#648ddb] text-[#648ddb] shadow-lg
                    hover:bg-[#648ddb] hover:text-white hover:shadow-[#648ddb]/30 hover:cursor-pointer
                    disabled:border-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed
                    disabled:bg-[#242b3d] disabled:hover:bg-[#242b3d]
                    disabled:hover:text-gray-600
                    disabled:shadow-none disabled:hover:shadow-none
                "
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <span className="text-secondary font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="
                    w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                    bg-[#242b3d] border-[#648ddb] text-[#648ddb] shadow-lg
                    hover:bg-[#648ddb] hover:text-white hover:shadow-[#648ddb]/30 hover:cursor-pointer
                    disabled:border-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed
                    disabled:bg-[#242b3d] disabled:hover:bg-[#242b3d]
                    disabled:hover:text-gray-600
                    disabled:shadow-none disabled:hover:shadow-none
                "
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    )
}

export default function BookingHistoryPage() {
    const [bookings, setBookings] = useState<BookingData[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedQr, setSelectedQr] = useState<string | null>(null)
    const { getBookings, isLoading } = useBooking()

    const BOOKINGS_PER_PAGE = 5;

    useEffect(() => {
        const load = async () => {
            const response = await getBookings(currentPage, BOOKINGS_PER_PAGE);
            if (response.success && response.data) {
                setBookings(response.data.items)
                setTotalPages(response.data.meta.totalPages)
            } else {
                setBookings([])
                setTotalPages(0)
            }
        }
        load()
    }, [currentPage])

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const groupSeatsByType = (seats: { typeSeat: { name: string }, name: string }[]) => {
        return Object.entries(
            seats.reduce((acc, seat) => {
            const typeName = seat.typeSeat.name || 'Standard';
            if (!acc[typeName]) acc[typeName] = [];
            acc[typeName].push(seat.name);
            return acc;
            }, {} as Record<string, string[]>)
        );
    }

    return (
        <ProtectedRoute>
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-primary mb-2">Booking History</h2>
                <p className="text-sm text-secondary mb-6">Review your past and upcoming bookings.</p>

                {isLoading && bookings.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : !isLoading && bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-secondary">You have no bookings yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row"
                                >
                                    {/* Movie Poster */}
                                    <div className="flex-shrink-0 md:w-48">
                                        <img
                                            src={booking.showTime.movie.poster}
                                            alt={booking.showTime.movie.name}
                                            className="w-full h-64 md:h-full object-cover"
                                        />
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 flex flex-col p-11">
                                         <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-xl text-primary">
                                                    {booking.showTime.movie.name}
                                                </h3>
                                                <p className="text-xs text-secondary mt-1">
                                                    Booked on: {formatDate(booking.dateTimeBooking)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <div className="font-bold text-xl text-primary">
                                                    {formatPrice(booking.totalBookingPrice)}
                                                </div>
                                                <div className="relative group w-fit pb-1">
                                                    {booking.checkInStatus ? (
                                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                                    ) : (
                                                        <XCircle className="text-gray-400 w-5 h-5" />
                                                    )}
                                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-1 py-1 rounded-md text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition bg-gray-700 whitespace-nowrap z-50">
                                                        {booking.checkInStatus ? 'Checked in' : 'Not checked in'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3 text-sm text-secondary">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {formatDate(booking.showTime.showDate)} •{' '}
                                                    {formatTime(booking.showTime.timeStart)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{booking.seats[0]?.room.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Armchair className="w-4 h-4 flex-shrink-0 mt-1" />

                                                <div className="flex-1 flex flex-col gap-1">
                                                    {groupSeatsByType(booking.seats).map(([typeName, seats]) => (
                                                    <div key={typeName} className="flex gap-1 items-center">
                                                        <span className="text-[#cccccc]">{typeName}:</span>
                                                        <span className="text-white">{seats.join(', ')}</span>
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {booking.refreshmentss && booking.refreshmentss.length > 0 && (
                                                <div className="flex items-start gap-2 pt-2 border-t border-border">
                                                    <Popcorn className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        Refreshments: {booking.refreshmentss.map(r => r.name).join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            {booking.qrUrl ? (
                                                <button onClick={() => setSelectedQr(booking.qrUrl)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors hover:shadow-lg hover:cursor-pointer transition-transform duration-300 hover:scale-105">
                                                    View QR Code
                                                </button>
                                            ) : (
                                                <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                                                    QR Code Unavailable
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    </>
                )}
                
                {selectedQr && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedQr(null)}>
                        <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                                <button onClick={() => setSelectedQr(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5 hover:cursor-pointer" />
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <img src={selectedQr} alt="QR Code" className="max-w-full h-auto rounded-lg" />
                            </div>
                            <p className="text-sm text-gray-500 text-center mt-4">
                                Show this QR code at the cinema entrance.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}