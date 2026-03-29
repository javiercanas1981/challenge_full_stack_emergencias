import { ActivityRepository, ContactActivity } from "../../../domain/src";
import { loggerFactory } from "../../../infrastructure/src/log/loggerFactory";
import { ApplicationError } from "../errors/ApplicationError";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { ContactActivityDTO } from "./dtos/ContactActivityDTO";

export class CreateActivity implements IUseCase<
  ContactActivityDTO,
  ContactActivityDTO
> {
  private logger = loggerFactory();

  constructor(
    private repo: ActivityRepository,
    private mapper: IMapper<ContactActivityDTO, ContactActivity>,
  ) {}

  async execute(dto: ContactActivityDTO): Promise<ContactActivityDTO> {
    this.validate(dto);

    const activity = await this.repo.create(this.mapper.toDomain(dto));

    this.logger.send("Activity created", "info", {
      id: activity.id,
    });

    return this.mapper.toDTO(activity);
  }

  private validate(dto: ContactActivityDTO) {
    const required = ["personId", "activityType", "activityDate"];

    for (const field of required) {
      if (!dto[field as keyof ContactActivityDTO]) {
        throw new ApplicationError(`${field} is required`);
      }
    }
  }
}
