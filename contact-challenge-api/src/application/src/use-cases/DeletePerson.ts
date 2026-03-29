import { PersonRepository } from "../../../domain/src";
import { loggerFactory } from "../../../infrastructure/src/log/loggerFactory";
import { ApplicationError } from "../errors/ApplicationError";

import { IUseCase } from "../interfaces/IUseCase";

export class DeletePerson implements IUseCase<number, void> {
  private logger = loggerFactory();

  constructor(private readonly personRepository: PersonRepository) {}

  async execute(id: number): Promise<void> {
    if (!id) {
      throw new ApplicationError("ID is required");
    }

    await this.personRepository.delete(id);

    this.logger.send("Person deleted", "info", { id });
  }
}
