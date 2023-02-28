import { ApiProperty } from '@nestjs/swagger';

export class PaginatedViewModel<T> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  data: T[];
}
