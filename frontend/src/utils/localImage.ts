const escapeText = (value: string) => value.replace(/[<>&"]/g, '').trim();

const toInitials = (value: string) => {
  const parts = escapeText(value).split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('');
  return initials || 'RM';
};

export const createPlaceholderImage = (label: string, width = 800, height = 600) => {
  const safeLabel = escapeText(label).slice(0, 32) || 'Phòng';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="24" fill="url(#g)"/>
      <rect x="${Math.round(width * 0.12)}" y="${Math.round(height * 0.18)}" width="${Math.round(width * 0.34)}" height="${Math.round(height * 0.34)}" rx="18" fill="#f8fafc" opacity="0.95"/>
      <rect x="${Math.round(width * 0.16)}" y="${Math.round(height * 0.24)}" width="${Math.round(width * 0.1)}" height="${Math.round(height * 0.18)}" rx="8" fill="#bfdbfe"/>
      <rect x="${Math.round(width * 0.29)}" y="${Math.round(height * 0.24)}" width="${Math.round(width * 0.12)}" height="${Math.round(height * 0.03)}" rx="8" fill="#94a3b8"/>
      <rect x="${Math.round(width * 0.29)}" y="${Math.round(height * 0.30)}" width="${Math.round(width * 0.09)}" height="${Math.round(height * 0.03)}" rx="8" fill="#cbd5e1"/>
      <rect x="${Math.round(width * 0.29)}" y="${Math.round(height * 0.36)}" width="${Math.round(width * 0.1)}" height="${Math.round(height * 0.03)}" rx="8" fill="#cbd5e1"/>
      <text x="${Math.round(width * 0.12)}" y="${Math.round(height * 0.76)}" font-family="Arial, sans-serif" font-size="${Math.max(18, Math.round(width * 0.035))}" fill="#475569">${safeLabel}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const createAvatarPlaceholder = (label: string, size = 128) => {
  const initials = toInitials(label);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="a" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#bfdbfe"/>
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#a)"/>
      <circle cx="${size / 2}" cy="${size / 2.4}" r="${size / 6}" fill="#60a5fa" opacity="0.85"/>
      <path d="M${size * 0.23} ${size * 0.82}c${size * 0.08}-${
    size * 0.14
  } ${size * 0.23}-${
    size * 0.2
  } ${size * 0.27}-${
    size * 0.2
  }s${size * 0.19} ${size * 0.06} ${size * 0.27} ${size * 0.2}" fill="#60a5fa" opacity="0.85"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(18, Math.round(size * 0.28))}" font-weight="700" fill="#1e3a8a">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
