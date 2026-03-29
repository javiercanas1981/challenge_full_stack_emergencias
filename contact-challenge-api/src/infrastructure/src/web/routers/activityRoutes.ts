import { Router } from "express";
import { ActivityController } from "../controllers/ActivityController";
import { asyncHandler } from "../middlewares/asyncHandler";

export const createActivityRoutes = (
  controller: ActivityController,
): Router => {
  const router = Router();

  router.post("/", asyncHandler(controller.create.bind(controller)));
  router.get(
    "/search",
    asyncHandler(controller.search.bind(controller) as any),
  );
  router.get(
    "/:personId/activities",
    asyncHandler(controller.getByPersonId.bind(controller) as any),
  );
  router.delete(
    "/:id",
    asyncHandler(controller.delete.bind(controller) as any),
  );

  return router;
};
