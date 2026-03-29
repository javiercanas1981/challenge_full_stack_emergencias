import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreatePhoneTypeDTO } from "./CreatePhoneTypeDTO";

export class CreatePhoneDTO {
  id?: number;

  personId?: number;

  @IsNotEmpty()
  number!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePhoneTypeDTO)
  phoneType!: CreatePhoneTypeDTO;
}
