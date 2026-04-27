import { Room, CreateRoomDto, UpdateRoomDto, PaginatedRoomResponse } from '../types/room.types';
import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes';
import api from '@/config/api';

const API_URL = API_URL_CLIENT + apiRoutes.ROOMS.BASE;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

export const getAllRoomsAdmin = async (page: number = 1, limit: number = 10): Promise<PaginatedRoomResponse> => {
  const response = await api.get<PaginatedRoomResponse>(
    apiRoutes.ROOMS.GET_ALL_ADMIN(page, limit),
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAllRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>(apiRoutes.ROOMS.GET_ALL);
  return response.data;
};

export const getRoomByConcept = async (concept: string): Promise<Room> => {
  const response = await api.get<Room>(apiRoutes.ROOMS.GET_BY_CONCEPT(concept));
  return response.data;
};

export const createRoom = async (roomData: CreateRoomDto): Promise<Room> => {
  const response = await api.post<Room>(apiRoutes.ROOMS.CREATE, roomData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateRoom = async (concept: string, roomData: UpdateRoomDto): Promise<Room> => {
  const response = await api.put<Room>(apiRoutes.ROOMS.UPDATE(concept), roomData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const toggleRoomVisibility = async (concept: string): Promise<Room> => {
  const response = await api.patch<Room>(apiRoutes.ROOMS.TOGGLE_VISIBILITY(concept), {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteRoom = async (concept: string): Promise<void> => {
  await api.delete(apiRoutes.ROOMS.DELETE(concept), {
    headers: getAuthHeaders(),
  });
};

export const RoomService = {
  getAllAdmin: getAllRoomsAdmin,
  getAll: getAllRooms,
  getByConcept: getRoomByConcept,
  create: createRoom,
  update: updateRoom,
  toggleVisibility: toggleRoomVisibility,
  delete: deleteRoom,
};
