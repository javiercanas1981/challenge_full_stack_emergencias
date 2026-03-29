import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import promBundle from "express-prom-bundle";
import helmet from "helmet";
import morgan from "morgan";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";

import {
  CreateActivity,
  CreatePerson,
  DeleteActivity,
  DeletePerson,
  GetActivitiesByPerson,
  GetAllPersons,
  GetPersonById,
  SearchActivities,
  SearchPerson,
  UpdatePerson,
} from "../../application/src";

import { DatabaseConnection } from "../../infrastructure/src/db/sqlite/DatabaseConnection";
import { requestLogger } from "../../infrastructure/src/log";

import { swaggerSpec } from "./config/swagger";

import { ActivityWithContactDetailsDTOMapper } from "../../application/src/use-cases/mappers/ActivityWithContactDetailsDTOMapper";
import { ContactActivityDTOMapper } from "../../application/src/use-cases/mappers/ContactActivityDTOMapper";
import { PersonDTOMapper } from "../../application/src/use-cases/mappers/PersonDTOMapper";
import { ContactActivityMapper } from "../../infrastructure/src/db/mappers/ContactActivityMapper";
import { PersonMapper } from "../../infrastructure/src/db/mappers/PersonMapper";
import {
  SqliteActivityRepository,
  SqlitePersonRepository,
} from "../../infrastructure/src/repositories";
import { ActivityController } from "../../infrastructure/src/web/controllers";
import { PersonController } from "../../infrastructure/src/web/controllers/PersonController";
import { errorHandler } from "../../infrastructure/src/web/middlewares/errorHandler";
import { createActivityRoutes } from "../../infrastructure/src/web/routers/activityRoutes";
import { createPersonRoutes } from "../../infrastructure/src/web/routers/personRoutes";

const dev = process.env.NODE_ENV !== "production";
if (dev) {
  require("dotenv").config({ path: ".env.development" });
}

export async function configureWebServer() {
  const loggerMiddleware = requestLogger();
  const app = express();

  // DB
  const db = await DatabaseConnection.getInstance().connect();
  await DatabaseConnection.getInstance().createTables();

  // Mappers Applications
  const contactActivityDTOMapper = new ContactActivityDTOMapper();
  const activityWithContactDetailsDTOMapper =
    new ActivityWithContactDetailsDTOMapper();
  const personDTOMapper = new PersonDTOMapper();

  // Mappers Infra

  const personMapper = new PersonMapper();
  const contactActivityMapper = new ContactActivityMapper();
  //const phoneMapper = new PhoneMapper();
  //const addressMapper = new AddressMapper();

  // Repositories
  const personRepo = new SqlitePersonRepository(db, personMapper as any);
  const activityRepo = new SqliteActivityRepository(db, contactActivityMapper);

  // UseCases (CON MAPPER)
  const createPerson = new CreatePerson(personRepo, personDTOMapper);
  const updatePerson = new UpdatePerson(personRepo, personDTOMapper);
  const searchPerson = new SearchPerson(personRepo, personDTOMapper);
  const deletePerson = new DeletePerson(personRepo);
  const getAllPersons = new GetAllPersons(personRepo, personDTOMapper);
  const getPersonById = new GetPersonById(personRepo, personDTOMapper);

  const createActivity = new CreateActivity(
    activityRepo,
    contactActivityDTOMapper,
  );
  const searchActivities = new SearchActivities(
    activityRepo,
    activityWithContactDetailsDTOMapper,
  );
  const deleteActivity = new DeleteActivity(activityRepo);
  const getActivitiesByPerson = new GetActivitiesByPerson(
    activityRepo,
    contactActivityDTOMapper,
  );

  // Controllers
  const personController = new PersonController(
    createPerson,
    updatePerson,
    searchPerson,
    deletePerson,
    getAllPersons,
    getPersonById,
  );

  const activityController = new ActivityController(
    createActivity,
    searchActivities,
    getActivitiesByPerson,
    deleteActivity,
  );

  // Middlewares
  const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === "true";

  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    promClient: { collectDefaultMetrics: {} },
  });

  app.use(helmet());
  app.use(morgan("combined"));
  app.use(metricsMiddleware as any);
  app.use(compression());
  app.use(cookieParser());

  app.use(
    cors({
      origin: ALLOW_ALL_ORIGINS ? "*" : "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.use((_req, res, next) => {
    res.header("Cache-Control", "no-cache");
    next();
  });

  const { app: appWithLogger } = loggerMiddleware.addDefaultLogger({
    app,
    bodyParser: express.json(),
  });

  // Health
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use("/api/contacts", createPersonRoutes(personController));
  app.use("/api/activities", createActivityRoutes(activityController));

  appWithLogger.use(errorHandler);
  loggerMiddleware.addErrorLogger(appWithLogger);

  return { app: appWithLogger };
}

export function startWebServer(app: express.Express) {
  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(async () => {
      console.log("HTTP server closed");
      await DatabaseConnection.getInstance().disconnect();
      process.exit(0);
    });
  });

  return app;
}
