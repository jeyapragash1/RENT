// Centralized API base URL for frontend -> backend communication
// Use NEXT_PUBLIC_API_BASE in .env for overrides (e.g. http://127.0.0.1:8000)
export const API_BASE = typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE
  ? process.env.NEXT_PUBLIC_API_BASE
  : 'http://127.0.0.1:8000';
