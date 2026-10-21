import { Secret, sign, verify, SignOptions } from 'jsonwebtoken';

import { HUserDocument } from '../../DB/Models/user.model';
import { env } from '../../config/config.service';

export const generateToken = ({
  payload,
  secret,
  options
}: {
  payload: object;
  secret: Secret;
  options: SignOptions;
}): string => {
  return sign(payload, secret, options);
};

export const verifyToken = ({
  token,
  secret
}: {
  token: string;
  secret: Secret;
}) => {
  return verify(token, secret);
};

export const createAccessToken = (user: HUserDocument): string => {
  return generateToken({
    payload: {
      id: user._id
    },
    secret: env.ACCESS_TOKEN_SECRET,
    options: {
      expiresIn: Number(env.ACCESS_TOKEN_EXPIRES_IN)
    }
  });
};

export const createLoginCredentials = (
  user: HUserDocument
): {
  accessToken: string;
  refreshToken: string;
} => {
  const accessToken = createAccessToken(user);

  const refreshToken = generateToken({
    payload: {
      id: user._id
    },
    secret: env.REFRESH_TOKEN_SECRET,
    options: {
      expiresIn: Number(env.REFRESH_TOKEN_EXPIRES_IN)
    }
  });

  return {
    accessToken,
    refreshToken
  };
};
