import config from '@/conf/services.json'

const API_BASE_URL = config.baseUrl;

export const api = {
    getProcesses: async () => {
        const response = await fetch(`${API_BASE_URL}/api/pm2/processes`);

        return response.json();
    },

    getProcessDetails: async (name: string, lines: number = 30) => {
        const response = await fetch(
            `${API_BASE_URL}/api/pm2/process/${name}?lines=${lines}`
        );
        return response.json();
    },

    getAllTests: async () => {
        const response = await fetch(`${API_BASE_URL}/api/tests`);
        return response.json();
    },

    getTestsSummary: async () => {
        const response = await fetch(`${API_BASE_URL}/api/tests/summary`);
        return response.json();
    },

    getSingleTest: async (processName: string) => {
        const response = await fetch(`${API_BASE_URL}/api/tests/${processName}`);
        return response.json();
    },
};