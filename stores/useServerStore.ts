import { create } from 'zustand';
import { Server, ServerStatus, Service, ProcessTestResult, ProcessLogs, PM2Process } from '@/types';
import { ApiClient } from '@/lib/api/client';
import config from '@/conf/services.json';

interface ServerStore {
    // State
    servers: Server[];
    serverStatuses: Map<string, ServerStatus>;
    selectedServer: string | null;
    selectedProcess: Service | null;
    processStats: Map<string, PM2Process | null>;
    testResults: Map<string, ProcessTestResult | null>;
    processLogs: Map<string, ProcessLogs | null>;
    isLoading: Map<string, boolean>;

    // Actions
    loadServers: () => Promise<void>;
    updateServerStatus: (serverName: string, status: ServerStatus) => void;
    getServerStatus: (serverName: string) => ServerStatus | undefined;
    selectServer: (serverName: string | null) => void;
    selectProcess: (process: Service | null) => void;
    loadProcessStats: (serverName: string, processName: string) => Promise<void>;
    runProcessTests: (serverName: string, processId: number) => Promise<void>;
    loadProcessLogs: (serverName: string, processId: number, lines?: number) => Promise<void>;
    clearProcessData: () => void;
}

export const useServerStore = create<ServerStore>((set, get) => ({
    // Initial state
    servers: [],
    serverStatuses: new Map(),
    selectedServer: null,
    selectedProcess: null,
    processStats: new Map(),
    testResults: new Map(),
    processLogs: new Map(),
    isLoading: new Map(),

    // Load servers from config
    loadServers: async () => {
        const servers = config.servers as Server[];
        // Инициализируем начальные статусы для всех серверов
        const initialStatuses = new Map<string, ServerStatus>();
        servers.forEach(server => {
            initialStatuses.set(server.name, {
                name: server.name,
                url: server.url,
                reachable: false,
                lastCheck: new Date(),
                requestTimeout: server.requestTimeout || 10000,
            });
        });
        set({ servers, serverStatuses: initialStatuses });
    },

    // Update server status
    updateServerStatus: (serverName: string, status: ServerStatus) => {
        set((state) => {
            const newStatuses = new Map(state.serverStatuses);
            newStatuses.set(serverName, status);
            return { serverStatuses: newStatuses };
        });
    },

    // Get server status
    getServerStatus: (serverName: string) => {
        return get().serverStatuses.get(serverName);
    },

    // Select server
    selectServer: (serverName: string | null) => {
        set({ selectedServer: serverName });
        if (!serverName) {
            set({ selectedProcess: null });
        }
    },

    // Select process
    selectProcess: (process: Service | null) => {
        set({ selectedProcess: process });
    },

    // Load process stats
    loadProcessStats: async (serverName: string, processName: string) => {
        const { servers, isLoading } = get();
        const loadingKey = `stats-${serverName}-${processName}`;

        if (isLoading.get(loadingKey)) {
            return;
        }

        const server = servers.find(s => s.name === serverName);
        if (!server) return;

        const client = new ApiClient(server.url, server.requestTimeout);

        set((state) => {
            const newLoading = new Map(state.isLoading);
            newLoading.set(loadingKey, true);
            return { isLoading: newLoading };
        });

        try {
            const response = await client.getProcesses();
            const process = response.processes.find((p: any) => p.name === processName);

            set((state) => {
                const newStats = new Map(state.processStats);
                newStats.set(`${serverName}-${processName}`, process || null);
                const newLoading = new Map(state.isLoading);
                newLoading.set(loadingKey, false);
                return { processStats: newStats, isLoading: newLoading };
            });
        } catch (error) {
            console.error('Error loading process stats:', error);
            set((state) => {
                const newLoading = new Map(state.isLoading);
                newLoading.set(loadingKey, false);
                return { isLoading: newLoading };
            });
        }
    },

    // Run process tests
    runProcessTests: async (serverName: string, processId: number) => {
        const { servers, isLoading } = get();
        const key = `${serverName}-${processId}`;
        const loadingKey = `tests-${key}`;

        if (isLoading.get(loadingKey)) {
            return;
        }

        const server = servers.find(s => s.name === serverName);
        if (!server) return;

        const client = new ApiClient(server.url, server.requestTimeout);

        set((state) => {
            const newLoading = new Map(state.isLoading);
            newLoading.set(loadingKey, true);
            return { isLoading: newLoading };
        });

        try {
            const result = await client.getTestForProcess(String(processId));

            set((state) => {
                const newResults = new Map(state.testResults);
                newResults.set(key, result);
                const newLoading = new Map(state.isLoading);
                newLoading.set(loadingKey, false);
                return { testResults: newResults, isLoading: newLoading };
            });
        } catch (error) {
            console.error('Error running tests:', error);
            set((state) => {
                const newLoading = new Map(state.isLoading);
                newLoading.set(loadingKey, false);
                return { isLoading: newLoading };
            });
        }
    },

    // Load process logs
    loadProcessLogs: async (serverName: string, processId: number, lines: number = 50) => {
        const { servers, isLoading } = get();
        const key = `${serverName}-${processId}`;
        const loadingKey = `logs-${key}`;

        if (isLoading.get(loadingKey)) {
            return;
        }

        const server = servers.find(s => s.name === serverName);
        if (!server) return;

        const client = new ApiClient(server.url, server.requestTimeout);

        set((state) => {
            const newLoading = new Map(state.isLoading);
            newLoading.set(loadingKey, true);
            return { isLoading: newLoading };
        });

        try {
            const logs = await client.getProcessDetails(processId, lines);

            set((state) => {
                const newLogs = new Map(state.processLogs);
                newLogs.set(key, logs);
                const newLoading = new Map(state.isLoading);
                newLoading.set(loadingKey, false);
                return { processLogs: newLogs, isLoading: newLoading };
            });
        } catch (error) {
            console.error('Error loading logs:', error);
            set((state) => {
                const newLoading = new Map(state.isLoading);
                newLoading.set(loadingKey, false);
                return { isLoading: newLoading };
            });
        }
    },

    // Clear process data
    clearProcessData: () => {
        set({
            selectedProcess: null,
            processStats: new Map(),
            testResults: new Map(),
            processLogs: new Map(),
        });
    },
}));