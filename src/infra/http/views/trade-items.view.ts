import { ApiProperty } from '@nestjs/swagger';
import { SurvivorViewModel } from './survivor.view';

export class TradeItemsViewModel {
  @ApiProperty({ type: SurvivorViewModel })
  requester: SurvivorViewModel;

  @ApiProperty({ type: SurvivorViewModel })
  receiver: SurvivorViewModel;
}
