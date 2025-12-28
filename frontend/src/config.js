function resolveDefaultApiBaseUrl() {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  if (window.__IDSYNCRO_API_URL__) {
    return window.__IDSYNCRO_API_URL__;
  }

  const { protocol, hostname, host } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:9091`;
  }

  return `${protocol}//${host}`;
}

const DEFAULT_API_BASE_URL = resolveDefaultApiBaseUrl();

export const API_BASE_URL = DEFAULT_API_BASE_URL;
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;

export function buildApiUrl(path = '') {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}
