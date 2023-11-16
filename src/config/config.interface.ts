export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
    }
    db: {
        host: string
        port: number
        username: string
        password: string
        name: string
        auth_source: string
    }
    jwt: {
        access_key: string
        algorithm: string
    }
    redis: {
        host: string
        port: number
        ttl: number
    }
    file: {
        max: number
        type: string[]
    }
    minio: {
        access_key: string
        secret_key: string
        endpoint: string
        bucket: string
        region: string
        ssl: boolean
    }
}
