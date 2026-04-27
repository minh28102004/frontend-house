import {
  RoomBooking,
  CreateBookingDto,
} from '@/modules/admin/rooms/types/booking.types';
import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/api';
import { getAuthHeaders } from '@/config/api';

export interface CreateBookingResponse {
  booking: RoomBooking;
  message: string;
}

export const createBooking = async (
  data: CreateBookingDto,
): Promise<CreateBookingResponse> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const response = await api.post<RoomBooking>(
    apiRoutes.ROOMS.CREATE_BOOKING,
    data,
    token ? { headers: getAuthHeaders(token) } : undefined,
  );
  return {
    booking: response.data,
    message: 'Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
  };
};

export const checkAvailability = async (
  concept: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<{ available: boolean; conflictingBookings: number }> => {
  const response = await api.post<{ available: boolean; conflictingBookings: number }>(
    apiRoutes.ROOMS.CHECK_AVAILABILITY,
    { concept, checkInDate, checkOutDate },
  );
  return response.data;
};

export const getBookingsByGuestEmail = async (
  email: string,
): Promise<RoomBooking[]> => {
  const response = await api.get<RoomBooking[]>(
    `/api/roomsapi/bookings/guest/${encodeURIComponent(email)}`,
  );
  return response.data;
};

/** Đặt phòng đã xác nhận, hôm nay nằm trong kỳ lưu trú (email trùng tài khoản). */
export const getMyCurrentStayBooking = async (
  token: string | null,
): Promise<RoomBooking | null> => {
  if (!token) {
    return null;
  }
  const response = await api.get<RoomBooking | null>(
    apiRoutes.ROOMS.MY_CURRENT_STAY,
    { headers: getAuthHeaders(token) },
  );
  return response.data;
};

export const getBookingsByDateRange = async (
  concept: string,
  startDate: string,
  endDate: string,
): Promise<RoomBooking[]> => {
  const response = await api.get<RoomBooking[]>(
    apiRoutes.ROOMS.GET_BOOKINGS_BY_DATE_RANGE(concept, startDate, endDate),
  );
  return response.data;
};

export const BookingClientService = {
  create: createBooking,
  checkAvailability,
  getByGuestEmail: getBookingsByGuestEmail,
  getMyCurrentStay: getMyCurrentStayBooking,
  getByDateRange: getBookingsByDateRange,
  getMyBookings: async (token: string | null): Promise<RoomBooking[]> => {
    if (!token) return [];
    const response = await api.get<RoomBooking[]>(
      apiRoutes.ROOMS.MY_BOOKINGS,
      { headers: getAuthHeaders(token) },
    );
    return response.data;
  },
};
