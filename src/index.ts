import { bootstrap } from "./app.controller";

bootstrap().catch((error: unknown) => {
  console.log(' Failed to start application :', error);
  process.exit(1);
});
