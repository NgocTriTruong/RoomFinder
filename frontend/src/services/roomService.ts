import api from './api';
import type { ApiResponse, RoomResponse, AmenityResponse, RoomDetailResponse, CreateRoomRequest, UpdateRoomRequest } from '@/types';

export const roomService = {
  /**
   * Get room details by ID
   */
  getRoomById: async (id: number | string): Promise<RoomDetailResponse> => {
    const response = await api.get<ApiResponse<RoomDetailResponse>>(`/v1/rooms/${id}`);
    return response.data.data!;
  },

  /**
   * Get landlord's own rooms
   */
  getMyRooms: async (): Promise<RoomResponse[]> => {
    const response = await api.get<ApiResponse<RoomResponse[]>>('/v1/rooms/my');
    return response.data.data!;
  },

  /**
   * Get all available amenities
   */
  getAllAmenities: async (): Promise<AmenityResponse[]> => {
    const response = await api.get<ApiResponse<AmenityResponse[]>>('/v1/rooms/amenities');
    return response.data.data!;
  },

  /**
   * Get amenities by category
   */
  getAmenitiesByCategory: async (category: string): Promise<AmenityResponse[]> => {
    const response = await api.get<ApiResponse<AmenityResponse[]>>(`/v1/rooms/amenities/category/${category}`);
    return response.data.data!;
  },

  /**
   * Create a new room
   */
  createRoom: async (data: CreateRoomRequest): Promise<RoomDetailResponse> => {
    const response = await api.post<ApiResponse<RoomDetailResponse>>('/v1/rooms', data);
    return response.data.data!;
  },

  /**
   * Update a room
   */
  updateRoom: async (id: number | string, data: UpdateRoomRequest): Promise<RoomDetailResponse> => {
    const response = await api.put<ApiResponse<RoomDetailResponse>>(`/v1/rooms/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete a room
   */
  deleteRoom: async (id: number | string): Promise<void> => {
    await api.delete(`/v1/rooms/${id}`);
  },

  /**
   * Add amenity to room
   */
  addAmenity: async (roomId: number | string, amenityId: number | string): Promise<RoomDetailResponse> => {
    const response = await api.post<ApiResponse<RoomDetailResponse>>(`/v1/rooms/${roomId}/amenities/${amenityId}`);
    return response.data.data!;
  },

  /**
   * Remove amenity from room
   */
  removeAmenity: async (roomId: number | string, amenityId: number | string): Promise<RoomDetailResponse> => {
    const response = await api.delete<ApiResponse<RoomDetailResponse>>(`/v1/rooms/${roomId}/amenities/${amenityId}`);
    return response.data.data!;
  },
};

export default roomService;
