import { ApiProperty } from '@nestjs/swagger';

export class ItemViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  points: number;
}
