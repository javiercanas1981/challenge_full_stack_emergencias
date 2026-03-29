import { ActivityRepository } from "../../../domain/src";
import { loggerFactory } from "../../../infrastructure/src/log/loggerFactory";
import { ApplicationError } from "../errors/ApplicationError";
import { IUseCase } from "../interfaces/IUseCase";

export class DeleteActivity implements IUseCase<number, void> {
  private logger = loggerFactory();

  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(id: number): Promise<void> {
    if (!id) throw new ApplicationError("ID is required");

    await this.activityRepository.delete(id);

    this.logger.send("Activity deleted", "info", { id });
  }
}
