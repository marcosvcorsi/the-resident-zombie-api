import { ApiProperty } from '@nestjs/swagger';
import { SurvivorViewModel } from './survivor.view';

export class PaginatedSurvivorViewModel {
  @ApiProperty()
  total: number;
  @ApiProperty()
  data: SurvivorViewModel[];
}
