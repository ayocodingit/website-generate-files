export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
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
