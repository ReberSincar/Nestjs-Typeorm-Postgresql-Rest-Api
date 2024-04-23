import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';

export class SearchBookDto extends PageOptionsDto {
  @ApiProperty()
  @IsString()
  searchKey: string;
}
