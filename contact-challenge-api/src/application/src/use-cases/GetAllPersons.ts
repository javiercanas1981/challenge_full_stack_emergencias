import { Person, PersonRepository } from "../../../domain/src";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { PersonDTO } from "./dtos/PersonDTO";

export class GetAllPersons implements IUseCase<void, PersonDTO[]> {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly mapper: IMapper<PersonDTO, Person>,
  ) {}

  async execute(): Promise<PersonDTO[]> {
    const persons = await this.personRepository.getAll();
    return persons.map((p) => this.mapper.toDTO(p));
  }
}
