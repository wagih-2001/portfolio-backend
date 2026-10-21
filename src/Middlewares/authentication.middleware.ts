import { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import { HUserDocument, userModel } from '../DB/Models/user.model';
import { env } from '../config/config.service';
import { verifyToken } from '../Utils/token/token.security';
import { UnauthorizedException } from '../Utils/res/error.response';

export enum TokenTypeEnum {
  Access = 'Access',
  Refresh = 'Refresh'
}

export const decodedToken = async ({
  authorization,
  tokenType = TokenTypeEnum.Access
}: {
  authorization?: string;
  tokenType?: TokenTypeEnum;
}): Promise<[HUserDocument, JwtPayload]> => {
  if (!authorization) {
    throw new UnauthorizedException('Authorization header missing');
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException('Invalid authorization header');
  }

  const secret =
    tokenType === TokenTypeEnum.Access
      ? env.ACCESS_TOKEN_SECRET
      : env.REFRESH_TOKEN_SECRET;

  const decoded = verifyToken({
    token,
    secret
  });

  if (typeof decoded === 'string' || !decoded.id) {
    throw new UnauthorizedException('Invalid token payload');
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  return [user, decoded];
};

export const authentication = ({
  tokenType = TokenTypeEnum.Access
}: {
  tokenType?: TokenTypeEnum;
} = {}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const [user, decoded] = await decodedToken({
      authorization: req.headers.authorization,
      tokenType
    });

    req.user = user;
    req.decoded = decoded;

    next();
  };
};
