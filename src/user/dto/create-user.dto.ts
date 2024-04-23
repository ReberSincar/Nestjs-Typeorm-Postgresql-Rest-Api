import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 'Password123' })
  @Length(6)
  password: string;

  @ApiProperty({ example: 'Firstname' })
  @IsString()
  @Length(2)
  firstName: string;

  @ApiProperty({ example: 'Lastname' })
  @IsString()
  @Length(2)
  lastName: string;

  @ApiProperty({ example: 'example@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+905551234567' })
  @IsPhoneNumber()
  phone: string;
}
