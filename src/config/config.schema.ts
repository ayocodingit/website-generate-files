import Joi from 'joi'

export default Joi.object({
    APP_NAME: Joi.string().required(),
    APP_ENV: Joi.string()
        .valid('local', 'staging', 'production')
        .default('local'),
    APP_PORT_HTTP: Joi.number().required(),
    APP_LOG: Joi.string().valid('info', 'error', 'warn').required(),
    FILE_TYPE: Joi.string()
        .optional()
        .default('image/jpg,image/png,image/jpeg,image/svg+xml'),
    FILE_MAX: Joi.number().optional().default(10),
    FILE_QUALITY: Joi.number().optional().default(80),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_SECRET_KEY: Joi.string().required(),
    MINIO_ENDPOINT: Joi.string().required(),
    MINIO_BUCKET: Joi.string().required(),
    MINIO_REGION: Joi.string().required(),
    MINIO_SSL: Joi.boolean().required(),
    SHORTLINK_URL: Joi.string().uri().optional(),
})
