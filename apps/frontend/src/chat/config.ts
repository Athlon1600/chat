const backendEndpoint: string = process.env.BACKEND_URL || 'http://localhost:3000';

export const CONFIG_BACKEND_URL = backendEndpoint;

// the purpose here is to provide sensible defaults in case nothing useful is inside .env
const config = {
    APP_URL: process.env.APP_URL || "",
    BACKEND_URL: backendEndpoint,
    WEBSOCKET_URL: process.env.WEBSOCKET_URL || backendEndpoint,
}

export const APP_CONFIG = config;
