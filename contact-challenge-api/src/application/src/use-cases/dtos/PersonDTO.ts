import { Type } from "class-transformer";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { CreateAddressDTO } from "./CreateAddressDTO";
import { CreatePhoneDTO } from "./CreatePhoneDTO";

export class PersonDTO {
  id?: number;

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePhoneDTO)
  phones?: CreatePhoneDTO[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDTO)
  addresses?: CreateAddressDTO[];
}
