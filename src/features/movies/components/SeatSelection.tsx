import React from 'react'

// --- Type Definitions ---
interface SeatSelectionProps {
    showtimeId: string // Dùng để fetch sơ đồ ghế thực tế trong tương lai
    selectedSeats: string[] // Danh sách ghế đang được chọn, VD: ['A1', 'B5']
    onSeatSelect: (seatId: string) => void // Hàm callback khi một ghế được click
}

// --- Mock Data (Dữ liệu giả lập cho sơ đồ ghế) ---
// Trong dự án thực tế, bạn sẽ fetch dữ liệu này từ API dựa trên showtimeId
const seatLayout = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    cols: 10,
    occupiedSeats: ['A3', 'C5', 'D6', 'F8', 'F9'] // Các ghế đã có người đặt
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ selectedSeats, onSeatSelect }) => {
    return (
        <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
            <h4 className="text-lg font-semibold text-white mb-4">Chọn ghế của bạn</h4>

            <div className="flex flex-col items-center bg-[#1a2232] p-4 rounded-lg">
                {/* Màn hình */}
                <div className="mb-4 h-2 bg-white/50 rounded-md w-2/3 mx-auto text-center text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                <p className="text-xs text-gray-400 mb-5">MÀN HÌNH</p>

                {/* Sơ đồ ghế */}
                <div className="flex flex-col gap-2.5">
                    {seatLayout.rows.map((row) => (
                        <div key={row} className="flex justify-center gap-2.5">
                            {Array.from({ length: seatLayout.cols }, (_, i) => {
                                const seatId = `${row}${i + 1}`
                                const isOccupied = seatLayout.occupiedSeats.includes(seatId)
                                const isSelected = selectedSeats.includes(seatId)

                                let seatClass = 'bg-[#648ddb] hover:bg-opacity-80' // Trống
                                if (isOccupied) seatClass = 'bg-gray-600 cursor-not-allowed'
                                if (isSelected)
                                    seatClass =
                                        'bg-[#fe7e32] scale-110 shadow-lg shadow-[#fe7e32]/50'

                                return (
                                    <button
                                        key={seatId}
                                        disabled={isOccupied}
                                        onClick={() => onSeatSelect(seatId)}
                                        className={`w-7 h-7 rounded text-xs font-semibold transition-all duration-200 ${seatClass}`}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* Chú thích */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#648ddb]"></div>
                        <span>Trống</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#fe7e32]"></div>
                        <span>Đang chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-600"></div>
                        <span>Đã bán</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeatSelection
