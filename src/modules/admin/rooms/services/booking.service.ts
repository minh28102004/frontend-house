import {
  RoomBooking,
  CreateBookingDto,
  UpdateBookingDto,
  BookingQueryDto,
  BookingListResponse,
  CheckAvailabilityDto,
  CheckAvailabilityResponse,
} from '../types/booking.types';
import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

export const getAllBookingsAdmin = async (
  params?: BookingQueryDto
): Promise<BookingListResponse> => {
  const response = await api.get<BookingListResponse>(
    apiRoutes.ROOMS.GET_BOOKINGS_ADMIN(params),
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getBookingById = async (id: string): Promise<RoomBooking> => {
  const response = await api.get<RoomBooking>(
    apiRoutes.ROOMS.GET_BOOKING_BY_ID(id),
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateBooking = async (
  id: string,
  bookingData: UpdateBookingDto
): Promise<RoomBooking> => {
  const response = await api.put<RoomBooking>(
    apiRoutes.ROOMS.UPDATE_BOOKING(id),
    bookingData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await api.delete(apiRoutes.ROOMS.DELETE_BOOKING(id), {
    headers: getAuthHeaders(),
  });
};

export const checkAvailability = async (
  data: CheckAvailabilityDto
): Promise<CheckAvailabilityResponse> => {
  const response = await api.post<CheckAvailabilityResponse>(
    apiRoutes.ROOMS.CHECK_AVAILABILITY,
    data
  );
  return response.data;
};

export const getBookingsByDateRange = async (
  concept: string,
  startDate: string,
  endDate: string
): Promise<RoomBooking[]> => {
  const response = await api.get<RoomBooking[]>(
    apiRoutes.ROOMS.GET_BOOKINGS_BY_DATE_RANGE(concept, startDate, endDate),
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getActiveRooms = async (): Promise<
  Array<{
    concept: string;
    roomName: string;
    bookings: RoomBooking[];
  }>
> => {
  const response = await api.get<Array<{
    concept: string;
    roomName: string;
    bookings: RoomBooking[];
  }>>(apiRoutes.ROOMS.GET_ACTIVE_ROOMS, { headers: getAuthHeaders() });
  return response.data;
};

export const BookingService = {
  getAllAdmin: getAllBookingsAdmin,
  getById: getBookingById,
  update: updateBooking,
  cancel: cancelBooking,
  checkAvailability,
  getByDateRange: getBookingsByDateRange,
  getActiveRooms,
};
