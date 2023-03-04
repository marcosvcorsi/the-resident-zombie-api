import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResourceAverage {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  average: number;
}

export class DashboardViewModel {}

@ObjectType()
export class Dashboard {
  @Field()
  infectedPercentage: number;

  @Field()
  nonInfectedPercentage: number;

  @Field()
  totalLostPoints: number;

  @Field(() => [ResourceAverage])
  resourcesAverage: ResourceAverage[];
}
