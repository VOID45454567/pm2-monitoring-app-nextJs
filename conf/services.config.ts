import servicesData from './services.json';

export interface ServiceConfig {
    pm2Id: number;
    name: string;
    requestTimeout: number;
    url: string;
}

export interface ServicesConfig {
    baseUrl: string;
    services: ServiceConfig[];
}

export const servicesConfig: ServicesConfig = servicesData;