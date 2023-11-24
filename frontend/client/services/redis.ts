import Redis, { RedisOptions } from 'ioredis';

type RedisConfig = {
    host: string | undefined,
    port: number,
    password: string | undefined
}

class RedisInstance {
    
    private static instance: RedisInstance;

    private constructor() {}

    public static getInstance(): RedisInstance {
        if (!RedisInstance.instance) {
            RedisInstance.instance = new RedisInstance();
        }

        return RedisInstance.instance;
    }

    public static getRedisConfiguration() {
        return {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD
        }
    }

    public static getOptions() {
        const { host, port, password }: RedisConfig = { ...RedisInstance.getRedisConfiguration() };

        const options: RedisOptions = {
            host: host,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            enableAutoPipelining: true,
            maxRetriesPerRequest: 0,
            retryStrategy: (times: number) => {
                if (times > 3) {
                    throw new Error(`[Redis] Could not connect after ${times} attempts`);
                }

                return Math.min(times * 200, 1000);
            },
        };

        if (port) {
            options.port = port;
        }

        if (password) {
            options.password = password;
        }

        return options;
    }

    public create() {
        try {
            const options = RedisInstance.getOptions();
            const redis = new Redis(options);

            redis.on('error', (error: unknown) => {
                console.warn('[Redis] Error connecting', error);
            });

            return redis;
        } catch (error) {
            throw new Error(`[Redis] Could not create a Redis instance`);
        }
    }
}

export function createRedisInstance() {
    return RedisInstance.getInstance().create();
}