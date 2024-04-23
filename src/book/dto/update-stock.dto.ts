import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { BookStockOperation } from '../enums/book-stock-operation.enum';

export class UpdateStockDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsEnum(BookStockOperation)
  operation: BookStockOperation;
}
