import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatedListDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;
}
