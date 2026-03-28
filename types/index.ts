export interface TestConfig {
    name: string;
    url: string;
    expectedStatusCode: number;
}

export interface Service {
    pm2Id: number;
    pm2Name: string;
    tests: TestConfig[];
}

export interface Server {
    name: string;
    url: string;
    requestTimeout?: number;
    services: Service[];
    status?: ServerStatus;
}

export interface ServerStatus {
    name: string;
    url: string;
    reachable: boolean;
    lastCheck: Date;
    responseTime?: number;
    error?: string;
    requestTimeout: number;
}

export interface PM2Process {
    name: string;
    pm2_id: number;
    pid: number;
    status: 'online' | 'stopped' | 'errored' | 'launching';
    cpu: number;
    memory: number;
    uptime: number;
    restart_time: number;
}

export interface TestResult {
    name: string;
    url: string;
    statusCode: number;
    expectedStatusCode: number;
    passed: boolean;
    error?: string;
}

export interface PM2HealthCheck {
    passed: boolean;
    status: string;
    expected: string;
    message?: string;
}

export interface ProcessTestResult {
    service: {
        name: string;
        pm2Id: number;
    };
    pm2: PM2HealthCheck;
    endpoints: TestResult[];
    summary: {
        total: number;
        passed: number;
        failed: number;
    };
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
    processes: PM2Process[];
    problems: Array<{
        service: string;
        pm2: string;
        failedEndpoints: string[];
    }>;
}

export interface ProcessLogs {
    status: string;
    out: string[];
    error: string[];
    hasErrors: boolean;
}

export interface ProcessDetails {
    status: string;
    out?: string[];
    error?: string[];
    outLogs?: string[];
    errLogs?: string[];
}