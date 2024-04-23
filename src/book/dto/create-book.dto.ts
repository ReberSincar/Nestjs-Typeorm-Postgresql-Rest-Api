import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  publisher: string;

  @ApiProperty()
  @IsNotEmpty()
  genre: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  storeId: number;
}
