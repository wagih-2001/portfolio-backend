import express, { Express } from 'express';
import { createServer } from 'node:http';
import connectDB from './DB/connections';
import { env } from './config/config.service';
import {
  authController,
  experienceController,
  profileController,
  projectController,
  resumeController,
  skillsController
} from './Modules';
import helmet from 'helmet';
import { corsMiddleware } from './Utils/security/cors.security';

export const bootstrap = async (): Promise<void> => {
  const app: Express = express();

  app.set('trust proxy', 1);

  // Security & Middleware
  app.use(corsMiddleware);
  app.use(helmet());
  app.use(express.json());

  await connectDB();

  const server = createServer(app);

  // Routes
  app.use('/api/v1/auth', authController);
  app.use('/api/v1/projects', projectController);
  app.use('/api/v1/skills', skillsController);
  app.use('/api/v1/experience', experienceController);
  app.use('/api/v1/profile', profileController);
  app.use('/api/v1/resume', resumeController);

  // Start the server
  server.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  // Start the server locally
  /*
  server.listen(env.PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${env.PORT}`);
  });
  */
};
