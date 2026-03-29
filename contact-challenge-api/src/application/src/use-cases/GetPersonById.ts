import { PersonRepository } from "../../../domain/src";
import { ApplicationError } from "../errors/ApplicationError";
import { IUseCase } from "../interfaces/IUseCase";
import { PersonDTO } from "./dtos/PersonDTO";
import { PersonDTOMapper } from "./mappers/PersonDTOMapper";

export class GetPersonById implements IUseCase<number, PersonDTO> {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly mapper: PersonDTOMapper,
  ) {}

  async execute(id: number): Promise<PersonDTO> {
    if (!id || isNaN(id)) {
      throw new ApplicationError(
        "id is required and must be a number",
        "VALIDATION_ERROR",
      );
    }

    const person = await this.personRepository.getById(id);

    if (!person) {
      throw new ApplicationError("Person not found", "NOT_FOUND");
    }

    return this.mapper.toDTO(person);
  }
}
