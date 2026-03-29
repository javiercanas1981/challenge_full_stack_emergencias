import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddressDTO {
  id?: number;

  @IsNotEmpty()
  @IsString()
  locality!: string;

  @IsNotEmpty()
  @IsString()
  street!: string;

  @IsNotEmpty()
  @IsNumber()
  number!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
