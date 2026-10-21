import { Router } from 'express';
import { authentication } from '../../Middlewares/authentication.middleware';
import { upload } from '../../Utils/upload/multer.util';
import {
  validateImageFile,
  validateOptionalImageFile
} from '../../Utils/upload/upload.validation';
import { validation } from '../../Middlewares/validation.middlewares';
import {
  CreateExperienceSchema,
  UpdateExperienceSchema
} from './experience.validations';
import { experienceService } from './experience.service';

const router = Router();
router.post(
  '/add-experience',
  authentication(),
  upload.single('image'),
  validateImageFile,
  validation(CreateExperienceSchema),
  experienceService.addExperience
);
router.patch(
  '/update-experience/:experienceId',
  authentication(),
  upload.single('image'),
  validateOptionalImageFile,
  validation(UpdateExperienceSchema),
  experienceService.updateExperience
);
router.get('/', experienceService.getExperience);
router.get('/:id', experienceService.getExperienceById);
router.delete(
  '/delete-experience/:experienceId',
  authentication(),
  experienceService.deleteExperience
);

export default router;
