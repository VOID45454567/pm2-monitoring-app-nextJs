import { useState, useCallback, useRef, useEffect } from 'react';
import { Service, PM2Process, ProcessTestResult, ProcessLogs } from '@/types';
import { ApiClient } from '@/lib/api/client';

interface UseProcessDetailsReturn {
    stats: PM2Process | null;
    testResults: ProcessTestResult | null;
    logs: ProcessLogs | null;
    isLoadingStats: boolean;
    isLoadingTests: boolean;
    isLoadingLogs: boolean;
    showLogs: boolean;
    loadStats: () => Promise<void>;
    runTests: () => Promise<void>;
    loadLogs: () => Promise<void>;
    toggleLogs: () => void;
    clearData: () => void;
}

export const useProcessDetails = (
    process: Service | null,
    serverUrl: string,
    serverTimeout?: number
): UseProcessDetailsReturn => {
    const [stats, setStats] = useState<PM2Process | null>(null);
    const [testResults, setTestResults] = useState<ProcessTestResult | null>(null);
    const [logs, setLogs] = useState<ProcessLogs | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingTests, setIsLoadingTests] = useState(false);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const apiClientRef = useRef<ApiClient | null>(null);
    const statsLoadingRef = useRef(false);
    const testsLoadingRef = useRef(false);
    const logsLoadingRef = useRef(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        apiClientRef.current = new ApiClient(serverUrl, serverTimeout);

        return () => {
            isMountedRef.current = false;
        };
    }, [serverUrl, serverTimeout]);

    const loadStats = useCallback(async () => {
        if (!process || !apiClientRef.current) return;
        if (statsLoadingRef.current) return;

        statsLoadingRef.current = true;
        setIsLoadingStats(true);

        try {
            const response = await apiClientRef.current.getProcesses();
            if (isMountedRef.current) {
                const foundProcess = response.processes.find(
                    (p: any) => p.name === process.pm2Name
                );
                setStats(foundProcess || null);
            }
        } catch (error) {
            console.error('Error loading process stats:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoadingStats(false);
            }
            statsLoadingRef.current = false;
        }
    }, [process]);

    const runTests = useCallback(async () => {
        if (!process || !apiClientRef.current) return;
        if (testsLoadingRef.current) return;

        testsLoadingRef.current = true;
        setIsLoadingTests(true);

        try {
            const result = await apiClientRef.current.getTestForProcess(String(process.pm2Id));
            if (isMountedRef.current) {
                setTestResults(result);
            }
        } catch (error) {
            console.error('Error running tests:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoadingTests(false);
            }
            testsLoadingRef.current = false;
        }
    }, [process]);

    const loadLogs = useCallback(async () => {
        if (!process || !apiClientRef.current) return;
        if (logsLoadingRef.current) return;

        logsLoadingRef.current = true;
        setIsLoadingLogs(true);

        try {
            const logsData = await apiClientRef.current.getProcessDetails(process.pm2Id, 50);
            if (isMountedRef.current) {
                setLogs(logsData);
            }
        } catch (error) {
            console.error('Error loading logs:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoadingLogs(false);
            }
            logsLoadingRef.current = false;
        }
    }, [process]);

    const toggleLogs = useCallback(() => {
        setShowLogs(prev => {
            const newShow = !prev;
            if (newShow && !logs && !logsLoadingRef.current) {
                loadLogs();
            }
            return newShow;
        });
    }, [logs, loadLogs]);

    const clearData = useCallback(() => {
        if (isMountedRef.current) {
            setStats(null);
            setTestResults(null);
            setLogs(null);
            setShowLogs(false);
        }
    }, []);

    return {
        stats,
        testResults,
        logs,
        isLoadingStats,
        isLoadingTests,
        isLoadingLogs,
        showLogs,
        loadStats,
        runTests,
        loadLogs,
        toggleLogs,
        clearData,
    };
};