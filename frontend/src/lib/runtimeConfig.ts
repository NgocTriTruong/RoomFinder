import api from '@/services/api';

export type PublicRuntimeConfig = {
  googleMapsApiKey: string;
  appUrl: string;
};

let runtimeConfigPromise: Promise<PublicRuntimeConfig> | null = null;

export async function loadPublicRuntimeConfig(): Promise<PublicRuntimeConfig> {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = api
      .get<{ success: boolean; data: PublicRuntimeConfig }>('/v1/config/public')
      .then((response) => response.data.data)
      .catch((error) => {
        runtimeConfigPromise = null;
        throw error;
      });
  }

  return runtimeConfigPromise;
}
