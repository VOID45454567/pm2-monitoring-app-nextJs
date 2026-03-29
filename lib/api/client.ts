import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { ProcessLogs } from '@/types';
import { DEFAULT_TIMEOUT, ERROR_MESSAGES } from '@/lib/utils/constants';

export class ApiClient {
    private client: AxiosInstance;
    private baseUrl: string;

    constructor(baseUrl: string, timeout: number = DEFAULT_TIMEOUT) {
        this.baseUrl = baseUrl;
        this.client = axios.create({
            baseURL: baseUrl,
            timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Добавляем интерцептор для логирования запросов
        this.client.interceptors.request.use(
            (config) => {
                console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
                return config;
            },
            (error) => {
                console.error('[API Request Error]', error);
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                console.log(`[API Response] ${response.status} from ${response.config.url}`);
                return response;
            },
            this.handleError.bind(this)
        );
    }

    private handleError(error: AxiosError) {
        console.error('[API Error]', {
            code: error.code,
            message: error.message,
            url: error.config?.url,
        });

        if (error.code === 'ECONNREFUSED') {
            console.error(`${ERROR_MESSAGES.CONNECTION_REFUSED}: ${this.baseUrl}`)
        }
        if (error.code === 'ENOTFOUND') {
            console.error(`${ERROR_MESSAGES.HOST_NOT_FOUND}: ${this.baseUrl}`)
        }
        if (error.code === 'ETIMEDOUT') {
            console.error(`${ERROR_MESSAGES.TIMEOUT}: ${this.baseUrl}`)
        }
        if (error.response) {
            console.error(`${ERROR_MESSAGES.SERVER_ERROR} ${error.response.status}: ${error.response.statusText}`)
        }
        console.error(`${ERROR_MESSAGES.NETWORK_ERROR}: ${this.baseUrl}`)
    }

    private async request<T>(fn: () => Promise<AxiosResponse<T>>): Promise<T> {
        const response = await fn();
        console.log('[API Response Data]', response.data);
        return response.data;
    }

    async getProcesses(): Promise<{ status: string; processes: any[] }> {
        return this.request(() => this.client.get('/api/pm2/processes'));
    }

    async getProcessDetails(pm2Id: number, lines: number = 50): Promise<ProcessLogs> {
        return this.request(() =>
            this.client.get(`/api/pm2/process/${pm2Id}`, {
                params: { lines },
            })
        );
    }

    async getHealthCheck(processName: string): Promise<any> {
        return this.request(() =>
            this.client.get(`/api/pm2/health/${processName}`)
        );
    }

    async getAllTests(): Promise<any[]> {
        return this.request(() => this.client.get('/api/tests'));
    }

    async getTestSummary(): Promise<any> {
        return this.request(() => this.client.get('/api/tests/summary'));
    }

    async getTestForProcess(processName: string): Promise<any> {
        return this.request(() => this.client.get(`/api/tests/${processName}`));
    }

    async checkConnection(): Promise<{ success: boolean; responseTime: number }> {
        const startTime = Date.now();
        console.log(`[Connection Check] Starting check to ${this.baseUrl}`);

        try {
            const result = await this.getProcesses();
            const responseTime = Date.now() - startTime;
            console.log(`[Connection Check] Success! Response time: ${responseTime}ms`, result);
            return { success: true, responseTime };
        } catch (error) {
            console.error(`[Connection Check] Failed:`, error);
            throw error;
        }
    }
}