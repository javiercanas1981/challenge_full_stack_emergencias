import { Person, PersonRepository } from "../../../domain/src";
import { loggerFactory } from "../../../infrastructure/src/log/loggerFactory";

import { ApplicationError } from "../errors/ApplicationError";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { PersonDTO } from "./dtos/PersonDTO";

export class CreatePerson implements IUseCase<PersonDTO, PersonDTO> {
  private logger = loggerFactory();
  private className = "CreatePerson";

  constructor(
    private personRepository: PersonRepository,
    private readonly mapper: IMapper<PersonDTO, Person>,
  ) {}

  async execute(dto: PersonDTO): Promise<PersonDTO> {
    this.logger.send("Executing CreatePerson use case", "debug", {
      class: this.className,
      method: "execute",
      payload: dto,
    });

    this.validate(dto);

    const existingPerson = await this.personRepository.findByEmail(dto.email);

    if (existingPerson) {
      this.logger.send("Person already exists", "warn", {
        email: dto.email,
        class: this.className,
        method: "execute",
      });
      throw new ApplicationError("A contact with this email already exists");
    }

    const personDomain = this.mapper.toDomain(dto);
    const createdPerson = await this.personRepository.create(personDomain);

    this.logger.send("Person created successfully", "info", {
      class: this.className,
      method: "execute",
      result: createdPerson,
    });

    return this.mapper.toDTO(createdPerson);
  }

  private validate(dto: PersonDTO) {
    const required = ["firstName", "lastName", "dateOfBirth", "email"];

    for (const field of required) {
      if (!dto[field as keyof PersonDTO]) {
        throw new ApplicationError(`${field} is required`, "VALIDATION_ERROR");
      }
    }
  }
}
