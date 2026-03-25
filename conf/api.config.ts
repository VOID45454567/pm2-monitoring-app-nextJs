import config from './services.json'

export const API_CONFIG = {
    baseURL: config.baseUrl,
    endpoints: {
        processes: {
            list: '/api/pm2/processes',
            details: (name: string, lines: number = 30) =>
                `/api/pm2/process/${encodeURIComponent(name)}?lines=${lines}`,
        },
        tests: {
            all: '/api/tests',
            summary: '/api/tests/summary',
            single: (name: string) => `/api/tests/${encodeURIComponent(name)}`,
        }
    }
};