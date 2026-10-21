import { Request, Response } from 'express';

import { userModel } from '../../DB/Models/user.model';
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException
} from '../../Utils/res/error.response';
import type { ILoginDTO } from './auth.dto';
import {
  createAccessToken,
  createLoginCredentials
} from '../../Utils/token/token.security';
import { compareHash } from '../../Utils/security/hashing.security';

class AuthService {
  constructor() {}

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: ILoginDTO = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password) {
      throw new BadRequestException('Invalid email or password');
    }
    const isValidPassword = await compareHash(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid email or password');
    }
    const { accessToken, refreshToken } = createLoginCredentials(user);

    return res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken
      }
    });
  };
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user || !req.decoded) {
      throw new UnauthorizedException('Unauthorized');
    }

    const accessToken = createAccessToken(req.user);

    return res.status(200).json({
      statusCode: 200,
      message: 'Access token refreshed successfully',
      data: {
        accessToken
      }
    });
  };
  logout = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Logged out successfully'
    });
  };
  me = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return res.status(200).json({
      statusCode: 200,
      message: 'Admin data fetched successfully',
      data: {
        user: req.user
      }
    });
  };
}

export default new AuthService();
