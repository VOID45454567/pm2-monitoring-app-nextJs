export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_AUTO_CHECK_INTERVAL = 30000;
export const DEFAULT_LOG_LINES = 50;

export const STATUS_COLORS = {
    online: 'text-green-400 bg-green-500/10 border-green-500/20',
    offline: 'text-red-400 bg-red-500/10 border-red-500/20',
    healthy: 'text-green-400 bg-green-500/10 border-green-500/20',
    unhealthy: 'text-red-400 bg-red-500/10 border-red-500/20',
    warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
} as const;

export const ERROR_MESSAGES = {
    CONNECTION_REFUSED: 'Connection refused: Unable to connect to server',
    HOST_NOT_FOUND: 'Host not found: Server is not reachable',
    TIMEOUT: 'Connection timeout',
    NETWORK_ERROR: 'Network error occurred',
    SERVER_ERROR: 'Server responded with an error',
} as const;