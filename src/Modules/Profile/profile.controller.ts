import { Router } from 'express';
import { authentication } from '../../Middlewares/authentication.middleware';
import { validation } from '../../Middlewares/validation.middlewares';
import { upload } from '../../Utils/upload/multer.util';
import {
  validateImageFile,
  validateOptionalImageFile
} from '../../Utils/upload/upload.validation';
import {
  CreateProfileSchema,
  UpdateProfileSchema
} from './profile.validations';
import { profileService } from './profile.service';

const router = Router();

router.post(
  '/add-profile',
  authentication(),
  upload.single('image'),
  validateImageFile,
  validation(CreateProfileSchema),
  profileService.createProfile
);

router.patch(
  '/update-profile',
  authentication(),
  upload.single('image'),
  validateOptionalImageFile,
  validation(UpdateProfileSchema),
  profileService.updateProfile
);

router.get('/', profileService.getProfile);

export default router;
