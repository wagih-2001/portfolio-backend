# Portfolio Backend API

Backend API for my personal portfolio.

## Features

- JWT Authentication
- Access & Refresh Tokens
- Admin Authentication
- Projects CRUD
- Skills CRUD
- Experience CRUD
- Profile Management
- Resume Upload
- Cloudinary File Storage
- MongoDB
- Rate Limiting
- Helmet
- CORS
- Docker

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Zod
- Docker

## Architecture / Project Structure

The project follows a modular backend architecture, separating configuration, database models, middleware, business modules, and reusable utilities.

```text
src/
├── config/
│   ├── cloudinary.config.ts
│   └── config.service.ts
│
├── DB/
│   ├── connections.ts
│   └── Models/
│       ├── experience.model.ts
│       ├── profile.model.ts
│       ├── project.model.ts
│       ├── resume.model.ts
│       ├── skills.model.ts
│       └── user.model.ts
│
├── Middlewares/
│   ├── authentication.middleware.ts
│   └── validation.middlewares.ts
│
├── Modules/
│   ├── Auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.dto.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validations.ts
│   │   └── index.ts
│   │
│   ├── Experience/
│   │   ├── experience.controller.ts
│   │   ├── experience.dto.ts
│   │   ├── experience.service.ts
│   │   ├── experience.validations.ts
│   │   └── index.ts
│   │
│   ├── Profile/
│   │   ├── profile.controller.ts
│   │   ├── profile.dto.ts
│   │   ├── profile.service.ts
│   │   ├── profile.validations.ts
│   │   └── index.ts
│   │
│   ├── Project/
│   │   ├── project.controller.ts
│   │   ├── project.dto.ts
│   │   ├── project.service.ts
│   │   ├── project.validations.ts
│   │   └── index.ts
│   │
│   ├── Resume/
│   │   ├── resume.controller.ts
│   │   ├── resume.service.ts
│   │   └── index.ts
│   │
│   └── Skills/
│       ├── skills.controller.ts
│       ├── skills.dto.ts
│       ├── skills.service.ts
│       ├── skills.validations.ts
│       └── index.ts
│
├── Utils/
│   ├── cloudinary/
│   │   └── cloudinary.utils.ts
│   ├── res/
│   │   └── error.response.ts
│   ├── security/
│   │   ├── hashing.security.ts
│   │   └── rate-limit.security.ts
│   ├── token/
│   │   └── token.security.ts
│   └── upload/
│       ├── multer.util.ts
│       └── upload.validation.ts
│
├── app.controller.ts
└── index.ts
```
