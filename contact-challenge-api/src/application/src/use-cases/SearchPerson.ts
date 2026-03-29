import { Person, PersonRepository } from "../../../domain/src";
import { ApplicationError } from "../errors/ApplicationError";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { PersonSearchCriteria } from "./criteria/PersonSearchCriteria";
import { PersonDTO } from "./dtos/PersonDTO";

export class SearchPerson implements IUseCase<
  PersonSearchCriteria,
  PersonDTO[]
> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly mapper: IMapper<PersonDTO, Person>,
  ) {}

  async execute(criteria: PersonSearchCriteria): Promise<PersonDTO[]> {
    const { email, firstName, lastName, phoneNumber, phoneType } = criteria;
    if (!email && !firstName && !lastName && !phoneNumber && !phoneType) {
      throw new ApplicationError(
        "At least one search criteria must be provided",
        "VALIDATION_ERROR",
      );
    }

    const persons = await this.repository.search(criteria);

    return persons.map((p) => this.mapper.toDTO(p));
  }
}
