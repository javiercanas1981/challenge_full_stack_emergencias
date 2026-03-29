import { Router } from "express";
import { PersonController } from "../controllers/PersonController";
import { asyncHandler } from "../middlewares/asyncHandler";

import { PersonDTO } from "../../../../application/src";
import { validationMiddleware } from "../middlewares/validationMiddleware";

export const createPersonRoutes = (controller: PersonController) => {
  const router = Router();

  router.post(
    "/",
    validationMiddleware(PersonDTO),
    asyncHandler(controller.create.bind(controller)),
  );

  router.get("/", asyncHandler(controller.getAll.bind(controller)));
  router.get("/search", asyncHandler(controller.search.bind(controller)));
  router.get("/:id", asyncHandler(controller.getById.bind(controller) as any));
  router.put(
    "/:id",
    validationMiddleware(PersonDTO),
    asyncHandler(controller.update.bind(controller) as any),
  );
  router.delete(
    "/:id",
    asyncHandler(controller.delete.bind(controller) as any),
  );

  return router;
};
