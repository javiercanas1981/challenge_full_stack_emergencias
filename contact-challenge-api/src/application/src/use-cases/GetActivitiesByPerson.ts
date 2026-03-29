import { ActivityRepository, ContactActivity } from "../../../domain/src";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { ContactActivityDTO } from "./dtos/ContactActivityDTO";

export class GetActivitiesByPerson implements IUseCase<
  number,
  ContactActivityDTO[]
> {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly mapper: IMapper<ContactActivityDTO, ContactActivity>,
  ) {}

  async execute(personId: number): Promise<ContactActivityDTO[]> {
    if (!personId) {
      throw new Error("personId is required");
    }

    const activities = await this.activityRepository.findByPerson(personId);

    return activities.map((activity) => this.mapper.toDTO(activity));
  }
}
