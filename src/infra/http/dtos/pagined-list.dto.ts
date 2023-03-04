import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatedListDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;
}
