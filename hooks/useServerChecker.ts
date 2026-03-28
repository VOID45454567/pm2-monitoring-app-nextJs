import { useState, useEffect, useCallback, useRef } from 'react';
import { Server, ServerStatus } from '@/types';
import { ApiClient } from '@/lib/api/client';
import { useServerStore } from '@/stores/useServerStore';

interface UseServerCheckerReturn {
    status: ServerStatus | null;
    isChecking: boolean;
    error: string | null;
    lastResponseTime: number | null;
    checkConnection: () => Promise<void>;
}

export const useServerChecker = (server: Server): UseServerCheckerReturn => {
    const [status, setStatus] = useState<ServerStatus | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResponseTime, setLastResponseTime] = useState<number | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);
    const isCheckingRef = useRef(false);
    const intervalStartedRef = useRef(false);

    const { updateServerStatus, getServerStatus } = useServerStore();

    const checkInterval = server.requestTimeout || 10000;

    const performCheck = useCallback(async () => {
        if (isCheckingRef.current) {
            console.log(`[${server.name}] ⏭️ Check already in progress, skipping`);
            return;
        }

        if (!isMountedRef.current) return;

        isCheckingRef.current = true;
        setIsChecking(true);

        const startTime = Date.now();
        const client = new ApiClient(server.url, server.requestTimeout);

        // console.log(`[${server.name}] 🔍 Starting health check to ${server.url}...`);

        try {
            const result = await client.checkConnection();
            const responseTime = Date.now() - startTime;

            // console.log(`[${server.name}] ✅ Check SUCCESS! Response time: ${responseTime}ms`);

            const newStatus: ServerStatus = {
                name: server.name,
                url: server.url,
                reachable: true,
                lastCheck: new Date(),
                responseTime,
                requestTimeout: server.requestTimeout || 10000,
            };

            if (isMountedRef.current) {
                setStatus(newStatus);
                setLastResponseTime(responseTime);
                setError(null);
                updateServerStatus(server.name, newStatus);
            }
        } catch (err: any) {
            const responseTime = Date.now() - startTime;

            const newStatus: ServerStatus = {
                name: server.name,
                url: server.url,
                reachable: false,
                lastCheck: new Date(),
                responseTime,
                error: err.message,
                requestTimeout: server.requestTimeout || 10000,
            };

            if (isMountedRef.current) {
                setStatus(newStatus);
                setLastResponseTime(responseTime);
                setError(err.message);
                updateServerStatus(server.name, newStatus);
            }
        } finally {
            if (isMountedRef.current) {
                setIsChecking(false);
            }
            isCheckingRef.current = false;
        }
    }, [server, updateServerStatus]);

    useEffect(() => {
        const savedStatus = getServerStatus(server.name);
        if (savedStatus && isMountedRef.current) {
            setStatus(savedStatus);
            setLastResponseTime(savedStatus.responseTime || null);
            setError(savedStatus.error || null);
        }
    }, [server.name, getServerStatus]);

    // Запускаем интервал только один раз
    useEffect(() => {
        if (intervalStartedRef.current) {
            return;
        }

        intervalStartedRef.current = true;

        // console.log(`[${server.name}] 🚀 Starting checker with interval: ${checkInterval / 1000}s`);

        // Первая проверка через 1 секунду
        timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
                performCheck();
            }
        }, 1000);

        // Периодическая проверка
        intervalRef.current = setInterval(() => {
            if (isMountedRef.current && !isCheckingRef.current) {
                performCheck();
            }
        }, checkInterval);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            isMountedRef.current = false;
        };
    }, [checkInterval, performCheck, server.name]);

    return {
        status,
        isChecking,
        error,
        lastResponseTime,
        checkConnection: performCheck,
    };
};