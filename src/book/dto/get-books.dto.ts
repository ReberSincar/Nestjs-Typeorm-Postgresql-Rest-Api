import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';

export class GetBooksDto extends PageOptionsDto {
  @ApiProperty()
  @IsNumber()
  store: number;
}
