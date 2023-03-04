import { ApiProperty } from '@nestjs/swagger';

export class ResourceAverage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  average: number;
}

export class DashboardViewModel {
  @ApiProperty()
  infectedPercentage: number;

  @ApiProperty()
  nonInfectedPercentage: number;

  @ApiProperty()
  totalLostPoints: number;

  @ApiProperty({
    type: ResourceAverage,
    isArray: true,
  })
  resourcesAverage: ResourceAverage[];
}
