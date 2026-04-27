import { Room, CreateRoomDto, UpdateRoomDto, PaginatedRoomResponse } from '../types';
import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

export const getAllRoomsHost = async (page: number = 1, limit: number = 100): Promise<PaginatedRoomResponse> => {
  const response = await api.get<PaginatedRoomResponse>(
    apiRoutes.ROOMS.GET_ALL_HOST(page, limit),
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getRoomByConcept = async (concept: string): Promise<Room> => {
  const response = await api.get<Room>(apiRoutes.ROOMS.GET_BY_CONCEPT(concept), {
    headers: getAuthHeaders() }
  );
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

export const HostRoomService = {
  getAll: getAllRoomsHost,
  getByConcept: getRoomByConcept,
  create: createRoom,
  update: updateRoom,
  toggleVisibility: toggleRoomVisibility,
};