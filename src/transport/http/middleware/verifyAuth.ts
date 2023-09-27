import { NextFunction, Response } from 'express'
import Jwt from '../../../pkg/jwt'
import statusCode from '../../../pkg/statusCode'

export const VerifyToken = (jwt: Jwt) => {
    return (req: any, res: Response, next: NextFunction) => {
        const { token } = req.params

        try {
            const decode = jwt.Verify(token)
            req['user'] = decode
            return next()
        } catch (err) {
            return res.status(statusCode.UNAUTHORIZED).json({
                error: statusCode[statusCode.UNAUTHORIZED]
            })
        }
    }
}
