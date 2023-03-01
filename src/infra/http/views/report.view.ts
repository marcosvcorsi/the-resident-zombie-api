import { ApiProperty } from '@nestjs/swagger';
import { SurvivorViewModel } from './survivor.view';

export class ReportViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: SurvivorViewModel })
  survivor: SurvivorViewModel;

  @ApiProperty()
  createdAt: Date;
}
