const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_ORIGIN = new URL(API_URL, window.location.origin).origin;

const normalizePath = (value: string) => {
  const trimmed = value.trim();
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

/**
 * Convert media paths returned by the API into a browser-usable URL.
 *
 * Supports:
 * - absolute URLs: returned as-is
 * - `/api/uploads/...`
 * - `/uploads/...`
 * - legacy `/rooms/...`, `/posts/...`, etc. -> mapped to `/api/uploads/...`
 */
export const resolveMediaUrl = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }

  const normalized = url.trim();
  if (!normalized) {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith('/api/')) {
    return `${API_ORIGIN}${normalized}`;
  }

  if (normalized.startsWith('/uploads/')) {
    return `${API_ORIGIN}/api${normalized}`;
  }

  if (
    normalized.startsWith('/rooms/') ||
    normalized.startsWith('/posts/') ||
    normalized.startsWith('/reviews/') ||
    normalized.startsWith('/avatars/') ||
    normalized.startsWith('/chat/') ||
    normalized.startsWith('/general/')
  ) {
    return `${API_ORIGIN}/api/uploads${normalizePath(normalized)}`;
  }

  return `${API_ORIGIN}/api/uploads${normalizePath(normalized)}`;
};
