import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-err';
import { SessionRequest } from '../types';

export default (req: SessionRequest, _res: Response, next: NextFunction) => {
  // const token = req.cookies.jwt;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');
    const { NODE_ENV, JWT_SECRET } = process.env;
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? String(JWT_SECRET) : 'dev-secret');
      req.user = payload;
      next();
    } catch {
      next(new UnauthorizedError('Необходима авторизация'));
    }
  }
};
