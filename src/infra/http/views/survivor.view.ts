import { ApiProperty } from '@nestjs/swagger';
import { Survivor } from '../../../domain/entities/survivor';

class Item {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  points: number;
}

class Inventory {
  @ApiProperty()
  item: Item;

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

  @ApiProperty()
  inventory: Inventory[];

  static toHttp(survivor: Survivor): SurvivorViewModel {
    return {
      ...survivor,
    };
  }
}
