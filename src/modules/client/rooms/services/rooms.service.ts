import { Room } from '../models/rooms.model';
import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/api';

export interface BackendRoom {
  _id: string;
  num: string;
  concept: string;
  name: string;
  description?: string;
  features: string[];
  price: number;
  thumbnail?: string;
  gallery: string[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAllRooms = async (concept?: string): Promise<Room[]> => {
  const url = concept && concept !== 'all'
    ? `${apiRoutes.ROOMS.GET_ALL}?concept=${concept}`
    : apiRoutes.ROOMS.GET_ALL;
  const response = await api.get<BackendRoom[]>(url);
  return response.data.map(mapBackendRoomToRoom);
};

export const getRoomByConcept = async (concept: string): Promise<Room> => {
  const response = await api.get<BackendRoom>(apiRoutes.ROOMS.GET_BY_CONCEPT(concept));
  return mapBackendRoomToRoom(response.data);
};

export function mapBackendRoomToRoom(data: BackendRoom): Room {
  const formattedPrice = data.price.toLocaleString('vi-VN');
  return {
    id: data._id,
    num: data.num,
    concept: data.concept,
    name: data.name,
    desc: data.description || '',
    features: data.features || [],
    price: formattedPrice,
    img: data.thumbnail || (data.gallery && data.gallery[0]) || '',
  };
}
