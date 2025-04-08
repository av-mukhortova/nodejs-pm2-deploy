import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface SessionRequest extends Request {
    user?: string | JwtPayload;
}
