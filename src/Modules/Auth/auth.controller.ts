import { Router } from 'express';
import authService from './auth.service';
import * as validators from './auth.validations';
import { validation } from '../../Middlewares/validation.middlewares';
import {
  authentication,
  TokenTypeEnum
} from '../../Middlewares/authentication.middleware';
import { loginRateLimit } from '../../Utils/security/rate-limit.security';

const router = Router();

router.post(
  '/login',
  loginRateLimit,
  validation(validators.LoginSchema),
  authService.login
);
router.post(
  '/refresh',
  authentication({
    tokenType: TokenTypeEnum.Refresh
  }),
  authService.refreshToken
);
router.post('/logout', authentication(), authService.logout);
router.get('/me', authentication(), authService.me);

export default router;
