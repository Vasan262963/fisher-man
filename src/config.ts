// Deployment URLs
const DEFAULT_BACKEND = 'http://localhost:5000';
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND}/api`;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || API_BASE_URL.replace('/api', '');


// Hardware WebSocket URL
export const HARDWARE_WS_URL = import.meta.env.VITE_HARDWARE_WS_URL || 'ws://localhost:5001/hardware';
