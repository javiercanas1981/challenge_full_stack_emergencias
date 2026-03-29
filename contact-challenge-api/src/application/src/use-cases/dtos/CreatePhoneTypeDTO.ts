import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePhoneTypeDTO {
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsString()
  typeName!: string;
}
