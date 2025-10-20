export interface SeatType {
  id: string
  name: string
  price: number
  color: string
}

export interface Seat {
  id: string
  name: string
  type: SeatType
}

export interface SeatLayout {
  rows: string[]
  cols: number
  occupiedSeats: string[]
  seats: Seat[]
}

export interface SeatLayoutResponse {
  roomId: string
  roomName: string
  seatLayout: SeatLayout
  totalSeats: number
  availableSeats: number
  occupiedSeats: number
  typeSeatList: SeatType[]
}
