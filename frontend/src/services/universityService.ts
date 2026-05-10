import api from './api';
import { ApiResponse } from '../types';

export interface UniversityResponse {
    id: number;
    name: string;
    abbreviation: string;
    address: string;
    province: string;
    district: string;
    latitude: number;
    longitude: number;
    logoUrl: string;
}

export const universityService = {
    getAll: async (province?: string, keyword?: string, district?: string): Promise<UniversityResponse[]> => {
        const response = await api.get<ApiResponse<UniversityResponse[]>>('/v1/universities', {
            params: { province, keyword, district },
        });
        return response.data.data!;
    },

    getById: async (id: number | string): Promise<UniversityResponse> => {
        const response = await api.get<ApiResponse<UniversityResponse>>(`/v1/universities/${id}`);
        return response.data.data!;
    },
};

export default universityService;
