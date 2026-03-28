import config from '@/conf/services.json';
import { Server, Service, PM2Process, ProcessTestResult, TestSummary, ProcessDetails } from '@/types';
import { ApiClient } from '@/lib/api/client';

export const api = () => ({
    async getAllServersWithProcesses(): Promise<Server[]> {
        return config.servers;
    },

    async getServerProcesses(serverName: string): Promise<Service[]> {
        const server = config.servers.find(s => s.name === serverName);
        if (!server) {
            throw new Error(`Server ${serverName} not found`);
        }
        return server.services;
    },

    async getProcessStats(serverName: string, processName: string): Promise<PM2Process | null> {
        try {
            const server = config.servers.find(s => s.name === serverName);
            if (!server) {
                throw new Error(`Server ${serverName} not found`);
            }

            const client = new ApiClient(server.url);
            const response = await client.getProcesses();
            const process = response.processes.find((p: any) => p.name === processName);
            return process || null;
        } catch (error) {
            console.error('Error getting process stats:', error);
            return null;
        }
    },

    async getProcessDetails(serverName: string, pm2Id: string, lines: number = 30): Promise<ProcessDetails | null> {
        try {
            const server = config.servers.find(s => s.name === serverName);
            if (!server) {
                throw new Error(`Server ${serverName} not found`);
            }

            const client = new ApiClient(server.url);
            const details = await client.getProcessDetails(+pm2Id, lines);
            return details;
        } catch (error) {
            console.error('Error getting process details:', error);
            return null;
        }
    },

    async testServer(serverName: string): Promise<{ success: boolean; message: string }> {
        try {
            const server = config.servers.find(s => s.name === serverName);
            if (!server) {
                throw new Error(`Server ${serverName} not found`);
            }

            // Try to get processes as a health check
            const client = new ApiClient(server.url);
            await client.getProcesses();
            return {
                success: true,
                message: `Server ${serverName} is reachable and responding`
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Server ${serverName} is not reachable: ${error.message}`
            };
        }
    },

    async testProcess(serverName: string, pm2ProcessId: string): Promise<ProcessTestResult | null> {
        try {
            const server = config.servers.find(s => s.name === serverName);
            if (!server) {
                throw new Error(`Server ${serverName} not found`);
            }

            const client = new ApiClient(server.url);
            const testResult = await client.getTestForProcess(pm2ProcessId);
            return testResult;
        } catch (error) {
            console.error('Error testing process:', error);
            return null;
        }
    },

    async getAllTestsSummary(serverName: string): Promise<TestSummary | null> {
        try {
            const server = config.servers.find(s => s.name === serverName);
            if (!server) {
                throw new Error(`Server ${serverName} not found`);
            }

            const client = new ApiClient(server.url);
            const summary = await client.getTestSummary();
            return summary;
        } catch (error) {
            console.error('Error getting test summary:', error);
            return null;
        }
    },

    async getAllTests(serverName: string): Promise<ProcessTestResult[] | null> {
        try {
            const server = config.servers.find(s => s.name === serverName);
            if (!server) {
                throw new Error(`Server ${serverName} not found`);
            }

            const client = new ApiClient(server.url);
            const tests = await client.getAllTests();
            return tests;
        } catch (error) {
            console.error('Error getting all tests:', error);
            return null;
        }
    }
});