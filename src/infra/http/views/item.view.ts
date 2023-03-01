import { ApiProperty } from '@nestjs/swagger';

export class ItemViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  points: number;
}

export class PaginatedItemsViewModel {
  @ApiProperty()
  total: number;
  @ApiProperty({
    type: ItemViewModel,
    isArray: true,
  })
  data: ItemViewModel[];
}
