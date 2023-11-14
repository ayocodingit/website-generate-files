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
})
