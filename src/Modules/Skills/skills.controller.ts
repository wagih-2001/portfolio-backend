import { Router } from 'express';
import { authentication } from '../../Middlewares/authentication.middleware';
import { upload } from '../../Utils/upload/multer.util';
import {
  validateImageFile,
  validateOptionalImageFile
} from '../../Utils/upload/upload.validation';
import { validation } from '../../Middlewares/validation.middlewares';
import { CreateSkillsSchema, UpdateSkillSchema } from './skills.validations';
import { skillsService } from './skills.service';

const router = Router();

router.post(
  '/add-skills',
  authentication(),
  upload.single('image'),
  validateImageFile,
  validation(CreateSkillsSchema),
  skillsService.addSkill
);

router.get('/', skillsService.getAllSkills);
router.get('/:id', skillsService.getSkillId);
router.patch(
  '/update-skills/:id',
  authentication(),
  upload.single('image'),
  validateOptionalImageFile,
  validation(UpdateSkillSchema),
  skillsService.updateSkill
);
router.delete(
  '/delete-skills/:id',
  authentication(),
  skillsService.deleteSkill
);
export default router;
