import { ApiProperty } from '@nestjs/swagger';
import { Survivor } from '../../../domain/entities/survivor';

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

  static toHttp(survivor: Survivor): SurvivorViewModel {
    return {
      ...survivor,
    };
  }
}
