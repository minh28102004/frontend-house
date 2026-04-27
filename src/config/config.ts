// /src/config/config.ts

import { envConfig } from './envConfig';
import { apiRoutes } from './apiRoutes';

export const API_URL = envConfig.API_URL;

export const config = {
    API_URL,
    APP_URL: envConfig.APP_URL,
    ROUTES: apiRoutes,
    DEFAULT_IMAGE_URL: '/images/default-thumbnail.png', // Default image if thumbnail not available
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_IMAGE_FORMATS: ['image/jpg', 'image/jpeg', 'image/png'],
    ENVIRONMENT: envConfig.ENVIRONMENT,
};
