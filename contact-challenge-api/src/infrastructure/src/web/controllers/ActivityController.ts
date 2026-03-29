import { Request, Response } from "express";
import {
  ActivitySearchCriteria,
  CreateActivity,
  DeleteActivity,
  GetActivitiesByPerson,
  SearchActivities,
} from "../../../../application/src";
import { ContactActivityDTO } from "../../../../application/src/use-cases/dtos/ContactActivityDTO";
import { ICrudController } from "../interfaces/ICrudController";

export class ActivityController implements ICrudController<
  ContactActivityDTO,
  ContactActivityDTO
> {
  constructor(
    private readonly createActivityUseCase: CreateActivity,
    private readonly searchActivitiesUseCase: SearchActivities,
    private readonly getActivitiesByPersonUseCase: GetActivitiesByPerson,
    private readonly deleteActivityUseCase: DeleteActivity,
  ) {}

  async getAll(_req: Request, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getById(_req: Request<{ id: string }>, _res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(
    _req: Request<{ id: string }, any, ContactActivityDTO>,
    _res: Response,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * @swagger
   * /activities:
   *   post:
   *     summary: Create a new activity for a person
   *     tags: [Activities]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateActivityDTO'
   *     responses:
   *       201:
   *         description: The activity was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ContactActivity'
   *       400:
   *         description: Invalid request (validation error)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async create(
    req: Request<{}, any, ContactActivityDTO>,
    res: Response,
  ): Promise<void> {
    const activity = await this.createActivityUseCase.execute(req.body);
    res.status(201).json(activity);
  }

  /**
   * @swagger
   * /persons/{personId}/activities:
   *   get:
   *     summary: Get all activities for a specific person
   *     tags: [Activities]
   *     parameters:
   *       - in: path
   *         name: personId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The person id
   *     responses:
   *       200:
   *         description: List of activities
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ContactActivity'
   *       404:
   *         description: Person not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getByPersonId(
    req: Request<{ personId: string }>,
    res: Response,
  ): Promise<void> {
    const personId = Number(req.params.personId);

    const activities =
      await this.getActivitiesByPersonUseCase.execute(personId);

    res.status(200).json(activities);
  }

  /**
   * @swagger
   * /activities/search:
   *   get:
   *     summary: Search activities by contact and activity type
   *     tags: [Activities]
   *     parameters:
   *       - in: query
   *         name: personId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The person id to filter by
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [call, meeting, email]
   *         required: true
   *         description: The activity type to filter by
   *     responses:
   *       200:
   *         description: List of activities with contact details
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   activity:
   *                     $ref: '#/components/schemas/ContactActivity'
   *                   contact:
   *                     type: object
   *                     properties:
   *                       firstName:
   *                         type: string
   *                       lastName:
   *                         type: string
   *                       email:
   *                         type: string
   *                       birthDate:
   *                         type: string
   *       400:
   *         description: Missing required parameters
   *       404:
   *         description: Person not found
   *       500:
   *         description: Internal server error
   */
  async search(
    req: Request<{}, any, any, { personId?: string; type?: string }>,
    res: Response,
  ): Promise<void> {
    const { personId, type } = req.query;

    const criteria: ActivitySearchCriteria = {
      personId: Number(personId),
      type: type as "call" | "meeting" | "email",
    };

    const result = await this.searchActivitiesUseCase.execute(criteria);
    res.status(200).json(result);
  }

  /**
   * @swagger
   * /activities/{id}:
   *   delete:
   *     summary: Delete an activity
   *     tags: [Activities]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The activity id
   *     responses:
   *       204:
   *         description: Activity deleted
   *       404:
   *         description: Activity not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id);

    await this.deleteActivityUseCase.execute(id);

    res.status(204).send();
  }
}
