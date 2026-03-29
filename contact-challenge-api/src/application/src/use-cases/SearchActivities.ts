import {
  ActivityRepository,
  ActivityWithContactDetails,
} from "../../../domain/src/index";

import { ActivitySearchCriteria } from "./criteria/ActivitySearchCriteria";

import { ApplicationError } from "../errors/ApplicationError";
import { IMapper } from "../interfaces/IMapper";
import { IUseCase } from "../interfaces/IUseCase";
import { ContactActivityDTO } from "./dtos/ContactActivityDTO";

export class SearchActivities implements IUseCase<
  ActivitySearchCriteria,
  ContactActivityDTO[]
> {
  constructor(
    private readonly repository: ActivityRepository,
    private readonly mapper: IMapper<
      ContactActivityDTO,
      ActivityWithContactDetails
    >,
  ) {}

  async execute(
    criteria: ActivitySearchCriteria,
  ): Promise<ContactActivityDTO[]> {
    const { personId, type } = criteria;

    if (type && !["call", "meeting", "email"].includes(type)) {
      throw new ApplicationError("Invalid activity type", "VALIDATION_ERROR");
    }

    let result: ActivityWithContactDetails[];

    if (personId) {
      if (type) {
        result = await this.repository.findByPersonAndType(personId, type);
      } else {
        result = await this.repository.findByPersonWithContactDetails(personId);
      }
    } else {
      result = await this.repository.findAllWithContactDetails();
      if (type) {
        result = result.filter((a) => a.activity.activityType === type);
      }
    }

    return result.map((r) => this.mapper.toDTO(r));
  }
}
