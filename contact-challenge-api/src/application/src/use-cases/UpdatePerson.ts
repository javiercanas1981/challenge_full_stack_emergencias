import { Person, PersonRepository } from "../../../domain/src";
import { loggerFactory } from "../../../infrastructure/src/log/loggerFactory";
import { ApplicationError } from "../errors/ApplicationError";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { PersonDTO } from "./dtos/PersonDTO";

export class UpdatePerson implements IUseCase<PersonDTO, void> {
  private logger = loggerFactory();
  private className = "UpdatePerson";

  constructor(
    private readonly repo: PersonRepository,
    private readonly mapper: IMapper<PersonDTO, Person>,
  ) {}

  async execute(dto: PersonDTO): Promise<void> {
    this.logger.send("Executing UpdatePerson use case", "debug", {
      class: this.className,
      method: "execute",
      payload: dto,
    });

    this.validate(dto);

    const existingPerson = await this.repo.getById(dto.id!);

    if (!existingPerson) {
      this.logger.send("Person to update not found", "warn", {
        id: dto.id,
        class: this.className,
        method: "execute",
      });
      throw new ApplicationError(
        `Person with ID ${dto.id} not found`,
        "NOT_FOUND",
      );
    }

    const person = this.mapper.toDomain(dto);

    this.logger.send("Sending update to repository", "debug", {
      id: person.id,
      class: this.className,
      method: "execute",
      domainModel: person,
    });

    try {
      await this.repo.update(person);

      this.logger.send("Person updated successfully", "info", {
        id: person.id,
        email: person.email,
        class: this.className,
        method: "execute",
      });
    } catch (error: any) {
      this.logger.send("Error during person update", "error", {
        id: person.id,
        error: error.message,
        class: this.className,
        method: "execute",
      });
      throw error;
    }
  }

  private validate(dto: PersonDTO): void {
    const requiredFields = [
      "id",
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
    ];

    for (const field of requiredFields) {
      if (!dto[field as keyof PersonDTO]) {
        this.logger.send(`Validation failed: missing ${field}`, "warn", {
          id: dto.id,
          class: this.className,
          method: "validate",
        });
        throw new ApplicationError(`${field} is required`, "VALIDATION_ERROR");
      }
    }
  }
}
