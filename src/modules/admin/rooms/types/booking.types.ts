export type BookingStatus =
  | 'pending'
  | 'pending_payment'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

/** Tài khoản website trùng email với email đặt phòng (admin active rooms). */
export interface BookingAccountUser {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
}

export interface RoomBooking {
  _id: string;
  roomId: string;
  concept: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestMessage?: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod?: 'COD' | 'VNPAY' | 'VIETQR';
  paymentStatus?: 'pending' | 'processing' | 'success' | 'failed' | 'expired' | 'cancelled';
  paymentTransactionId?: string;
  paymentRef?: string;
  paidAt?: string;
  specialRequests?: string;
  numberOfGuests: number;
  cccdFront?: string;
  cccdBack?: string;
  createdAt?: string;
  updatedAt?: string;
  /** User đăng nhập lúc gửi form đặt phòng (server lưu từ JWT). */
  bookedByUserId?: string;
  /** Từ API active-rooms: user đăng ký trùng email khách, hoặc null nếu không có. */
  accountUser?: BookingAccountUser | null;
}

export interface CreateBookingDto {
  concept: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestMessage?: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  specialRequests?: string;
  numberOfGuests?: number;
  cccdFront?: string;
  cccdBack?: string;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  specialRequests?: string;
  numberOfGuests?: number;
}

export interface BookingQueryDto {
  page?: number;
  limit?: number;
  concept?: string;
  status?: BookingStatus;
  guestEmail?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface BookingListResponse {
  data: RoomBooking[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CheckAvailabilityDto {
  concept: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflictingBookings: number;
}
