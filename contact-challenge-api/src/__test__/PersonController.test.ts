import { Request, Response } from "express";
import {
    CreatePerson,
    DeletePerson,
    GetAllPersons,
    GetPersonById,
    PersonDTO,
    SearchPerson,
    UpdatePerson,
} from "../application/src";
import { PersonController } from "../infrastructure/web/controllers/index";
import { HttpError } from "../infrastructure/web/middlewares/errorHandler";

jest.mock("../application");

jest.mock("../infrastructure/log/loggerFactory", () => ({
  loggerFactory: () => ({
    send: jest.fn(),
  }),
}));

jest.mock("../infrastructure/web/validators/PersonSchemas", () => ({
  updatePersonSchema: {
    parse: jest.fn((data) => data),
  },
}));

describe("PersonController", () => {
  let controller: PersonController;
  let createPersonUseCase: jest.Mocked<CreatePerson>;
  let updatePersonUseCase: jest.Mocked<UpdatePerson>;
  let searchPersonUseCase: jest.Mocked<SearchPerson>;
  let deletePersonUseCase: jest.Mocked<DeletePerson>;
  let getAllPersonsUseCase: jest.Mocked<GetAllPersons>;
  let getPersonByIdUseCase: jest.Mocked<GetPersonById>;

  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockPerson: PersonDTO = {
    id: 1,
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@example.com",
    dateOfBirth: "1990-01-01",
    phones: [] as any,
    addresses: [] as any,
  };

  beforeEach(() => {
    createPersonUseCase = { execute: jest.fn() } as any;
    updatePersonUseCase = { execute: jest.fn() } as any;
    searchPersonUseCase = { execute: jest.fn() } as any;
    deletePersonUseCase = { execute: jest.fn() } as any;
    getAllPersonsUseCase = { execute: jest.fn() } as any;
    getPersonByIdUseCase = { execute: jest.fn() } as any;

    controller = new PersonController(
      createPersonUseCase,
      updatePersonUseCase,
      searchPersonUseCase,
      deletePersonUseCase,
      getAllPersonsUseCase,
      getPersonByIdUseCase,
    );

    req = { params: {}, query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("create", () => {
    it("debe crear una persona y retornar 201", async () => {
      req.body = {
        firstName: "Juan",
        lastName: "Perez",
        email: "juan@example.com",
        phones: [{ phoneNumber: "123456", phoneType: "mobile" }],
        addresses: [],
      };

      createPersonUseCase.execute.mockResolvedValue(mockPerson as any);

      await controller.create(req as Request, res as Response);

      expect(createPersonUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Juan",
          phones: expect.arrayContaining([
            expect.objectContaining({
              number: "123456",
              phoneType: expect.objectContaining({ id: 1, typeName: "mobile" }),
            }),
          ]),
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPerson);
    });
  });

  describe("getAll", () => {
    it("debe retornar una lista de personas con estado 200", async () => {
      const persons = [mockPerson];
      getAllPersonsUseCase.execute.mockResolvedValue(persons as any);

      await controller.getAll(req as Request, res as Response);

      expect(getAllPersonsUseCase.execute).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(persons);
    });
  });

  describe("search", () => {
    it("debe buscar personas usando query params y retornar 200", async () => {
      req.query = { firstName: "Juan", email: "juan@example.com" };
      searchPersonUseCase.execute.mockResolvedValue([mockPerson as any]);

      await controller.search(req as Request, res as Response);

      expect(searchPersonUseCase.execute).toHaveBeenCalledWith({
        firstName: "Juan",
        email: "juan@example.com",
        lastName: undefined,
        phoneNumber: undefined,
        phoneType: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockPerson]);
    });
  });

  describe("getById", () => {
    it("debe retornar una persona si existe (200)", async () => {
      req.params = { id: "1" };
      getPersonByIdUseCase.execute.mockResolvedValue(mockPerson as any);

      await controller.getById(req as Request, res as Response);

      expect(getPersonByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPerson);
    });

    it("debe lanzar HttpError 404 si la persona no existe", async () => {
      req.params = { id: "999" };
      getPersonByIdUseCase.execute.mockResolvedValue(null);

      await expect(
        controller.getById(req as Request, res as Response),
      ).rejects.toThrow(HttpError);

      await expect(
        controller.getById(req as Request, res as Response),
      ).rejects.toThrow("Person not found");
    });
  });

  describe("update", () => {
    it("debe actualizar una persona y retornar 204", async () => {
      req.params = { id: "1" };
      req.body = {
        firstName: "Juan Updated",
        lastName: "Perez",
        email: "juan@example.com",
        phones: [],
        addresses: [],
      };

      await controller.update(req as Request, res as Response);

      expect(updatePersonUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          firstName: "Juan Updated",
        }),
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("debe eliminar una persona si existe y retornar 204", async () => {
      req.params = { id: "1" };

      getPersonByIdUseCase.execute.mockResolvedValue(mockPerson as any);

      await controller.delete(req as Request, res as Response);

      expect(getPersonByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(deletePersonUseCase.execute).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("debe lanzar 404 si intenta eliminar una persona que no existe", async () => {
      req.params = { id: "999" };
      getPersonByIdUseCase.execute.mockResolvedValue(null);

      await expect(
        controller.delete(req as Request, res as Response),
      ).rejects.toThrow(HttpError);

      expect(deletePersonUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
