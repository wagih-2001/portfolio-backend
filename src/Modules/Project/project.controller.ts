import { Router } from 'express';
import { authentication } from '../../Middlewares/authentication.middleware';
import { upload } from '../../Utils/upload/multer.util';
import {
  validateImageFile,
  validateOptionalImageFile
} from '../../Utils/upload/upload.validation';
import {
  CreateProjectSchema,
  UpdateProjectSchema
} from './project.validations';
import { validation } from '../../Middlewares/validation.middlewares';
import { projectService } from './project.service';

const router = Router();
router.post(
  '/add-project',
  authentication(),
  upload.single('image'),
  validateImageFile,
  validation(CreateProjectSchema),
  projectService.addProject
);
router.patch(
  '/update-project/:projectId',
  authentication(),
  upload.single('image'),
  validateOptionalImageFile,
  validation(UpdateProjectSchema),
  projectService.updateProject
);
router.get('/', projectService.getProjects);
router.get('/:id', projectService.getProjectById);
router.patch(
  '/soft-delete/:projectId',
  authentication(),
  projectService.softDeleteProject
);

router.delete(
  '/hard-delete/:projectId',
  authentication(),
  projectService.hardDeleteProject
);

export default router;
