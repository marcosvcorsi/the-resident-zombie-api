import { ApiProperty } from '@nestjs/swagger';
import { Survivor } from '../../../domain/entities/survivor';
import { ItemViewModel } from './item.view';

class InventoryItemViewModel {
  @ApiProperty()
  item: ItemViewModel;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class SurvivorViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty({
    type: InventoryItemViewModel,
    isArray: true,
  })
  inventoryItems: InventoryItemViewModel[];

  static toHttp(survivor: Survivor): SurvivorViewModel {
    return {
      ...survivor,
    };
  }
}

export class PaginatedSurvivorsViewModel {
  @ApiProperty()
  total: number;
  @ApiProperty({
    type: SurvivorViewModel,
    isArray: true,
  })
  data: SurvivorViewModel[];
}
