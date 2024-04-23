import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';

export class CreateBookStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'example1@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+905353333333' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'Example address' })
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @ApiProperty({ example: 'www.example.com' })
  @IsUrl()
  @IsOptional()
  website: string;
}
