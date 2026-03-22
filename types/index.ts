export interface Process {
    id: number;
    name: string;
    pid: number;
    status: string;
    cpu: number;
    memory: number;
    uptime: number;
}

export interface ProcessDetails {
    process: Process[];
    out: string[];
    error: string[];
    hasErrors: boolean;
}

export interface EndpointTest {
    name: string;
    url: string;
    method: string;
    expected: number;
    actual: number;
    passed: boolean;
    duration: number;
}

export interface TestResult {
    service: {
        name: string;
        id: string;
        pm2ID: number;
    };
    pm2: {
        status: string;
        expected: string;
        passed: boolean;
    };
    endpoints: EndpointTest[];
    summary: {
        passed: number;
        failed: number;
        total: number;
    };
    timestamp: string;
}

export interface TestSummary {
    timestamp: string;
    services: {
        total: number;
        healthy: number;
        problematic: number;
    };
    tests: {
        total: number;
        passed: number;
        failed: number;
        successRate: string;
    };
    processes: Process[];
    problems: Array<{
        service: string;
        pm2: string;
        failedEndpoints: string[];
    }>;
}

export interface ApiResponse<T> {
    status?: string;
    data?: T;
}