export interface Room {
  _id?: string;
  num: string;
  concept: string;
  name: string;
  description?: string;
  features?: string[];
  price: number;
  thumbnail?: string;
  gallery?: string[];
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomDto {
  num: string;
  concept: string;
  name: string;
  description?: string;
  features?: string[];
  price: number;
  thumbnail?: string;
  gallery?: string[];
  isVisible?: boolean;
}

export interface UpdateRoomDto {
  num?: string;
  concept?: string;
  name?: string;
  description?: string;
  features?: string[];
  price?: number;
  thumbnail?: string;
  gallery?: string[];
  isVisible?: boolean;
}

export interface RoomListResponse {
  data: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedRoomResponse {
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
