import { Request, Response } from "express";

import { PersonDTO, PersonSearchCriteria } from "../../../../application/src";
import { IUseCase } from "../../../../application/src/interfaces/IUseCase";
import { ICrudController } from "../interfaces/ICrudController";
import { HttpError } from "../middlewares/errorHandler";
import {
    createPersonSchema,
    updatePersonSchema,
} from "../validators/PersonSchemas";

export class PersonController implements ICrudController<PersonDTO, PersonDTO> {
  constructor(
    private readonly createUC: IUseCase<PersonDTO, PersonDTO>,
    private readonly updateUC: IUseCase<PersonDTO, void>,
    private readonly searchUC: IUseCase<any, PersonDTO[]>,
    private readonly deleteUC: IUseCase<number, void>,
    private readonly getAllUC: IUseCase<void, PersonDTO[]>,
    private readonly getByIdUC: IUseCase<number, PersonDTO | null>,
  ) {}

  /**
   * @swagger
   * components:
   *   schemas:
   *     CreatePhoneDTO:
   *       type: object
   *       required:
   *         - phoneNumber
   *         - phoneType
   *       properties:
   *         phoneNumber:
   *           type: string
   *           example: "1123456789"
   *         phoneType:
   *           type: string
   *           enum: [mobile, home, work]
   *           example: "mobile"
   *     CreateAddressDTO:
   *       type: object
   *       required:
   *         - street
   *         - locality
   *         - number
   *         - notes
   *       properties:
   *         street:
   *           type: string
   *           example: "Calle Falsa"
   *         locality:
   *           type: string
   *           example: "Caba"
   *         number:
   *           type: integer
   *           example: 1000
   *         notes:
   *           type: string
   *           example: "Departamento 2B"
   *     CreatePersonDTO:
   *       type: object
   *       required:
   *         - firstName
   *         - lastName
   *         - dateOfBirth
   *         - email
   *       properties:
   *         firstName:
   *           type: string
   *           example: "Juan"
   *         lastName:
   *           type: string
   *           example: "Pérez"
   *         dateOfBirth:
   *           type: string
   *           format: date
   *           example: "1990-05-15"
   *         email:
   *           type: string
   *           format: email
   *           example: "juan.perez@example.com"
   *         phones:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/CreatePhoneDTO'
   *         addresses:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/CreateAddressDTO'
   */

  /**
   * @swagger
   * /persons:
   *   post:
   *     summary: Create a new person
   *     tags: [Persons]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePersonDTO'
   *     responses:
   *       201:
   *         description: The person was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Person'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "A contact with this email already exists"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Internal Server Error"
   */
  create = async (req: Request<{}, any, any>, res: Response): Promise<void> => {
    const dto = createPersonSchema.parse(req.body);
    const result = await this.createUC.execute(dto as PersonDTO);
    res.status(201).json(result);
  };

  async getAll(_req: Request, res: Response): Promise<void> {
    res.status(200).json(await this.getAllUC.execute());
  }

  /**
   * @swagger
   * /persons/search:
   *   get:
   *     summary: Search persons by query parameters
   *     tags: [Persons]
   *     parameters:
   *       - in: query
   *         name: firstName
   *         schema:
   *           type: string
   *         description: Filter by first name
   *       - in: query
   *         name: lastName
   *         schema:
   *           type: string
   *         description: Filter by last name
   *       - in: query
   *         name: email
   *         schema:
   *           type: string
   *         description: Filter by email
   *     responses:
   *       200:
   *         description: List of persons matching query
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Person'
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
  async search(
    req: Request<{}, any, any, PersonSearchCriteria>,
    res: Response,
  ): Promise<void> {
    const persons = await this.searchUC.execute(req.query);
    res.status(200).json(persons);
  }

  /**
   * @swagger
   * /persons/{id}:
   *   get:
   *     summary: Get the person by id
   *     tags: [Persons]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The person id
   *     responses:
   *       200:
   *         description: The person description by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Person'
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
  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id);

    const person = await this.getByIdUC.execute(id);

    if (!person) {
      throw new HttpError("Person not found", 404);
    }

    res.status(200).json(person);
  }

  /**
   * @swagger
   * /persons/{id}:
   *   put:
   *     summary: Update a person
   *     tags: [Persons]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The person id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Person'
   *     responses:
   *       204:
   *         description: The person was updated
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
  async update(
    req: Request<{ id: string }, any, any>,
    res: Response,
  ): Promise<void> {
    const id = Number(req.params.id);
    const validatedData = updatePersonSchema.parse({ ...req.body, id });

    await this.updateUC.execute(validatedData as PersonDTO);
    res.status(204).send();
  }

  /**
   * @swagger
   * /persons/{id}:
   *   delete:
   *     summary: Remove the person by id
   *     tags: [Persons]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The person id
   *     responses:
   *       204:
   *         description: The person was deleted
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
  async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await this.deleteUC.execute(id);
    res.status(204).send();
  }
}
