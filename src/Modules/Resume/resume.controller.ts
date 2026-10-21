import { Router } from 'express';

import { authentication } from '../../Middlewares/authentication.middleware';

import { upload } from '../../Utils/upload/multer.util';

import { validatePDFFile } from '../../Utils/upload/upload.validation';

import { resumeService } from './resume.service';

const router = Router();

router.put(
  '/update-resume',
  authentication(),
  upload.single('resume'),
  validatePDFFile,
  resumeService.uploadOrUpdateResume
);

router.get('/', resumeService.getResume);

export default router;
