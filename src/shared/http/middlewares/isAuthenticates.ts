import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from 'src/shared/errors/AppError';
import authConfig from 'src/config/auth'

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(request: Request,response: Response,next: NextFunction,):
void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Problema com JWT Token.');
  }
  
  const [type, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as TokenPayload;

    request.user = { id: sub, };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token.');
  }
}