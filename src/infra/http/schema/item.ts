import { ArgsType, Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  points: number;
}

@ObjectType()
export class PaginatedItemResponse {
  @Field()
  total: number;

  @Field(() => [Item])
  data: Item[];
}

@ArgsType()
export class ItemsArgs {
  @Field(() => Int, { defaultValue: 20 })
  first: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}
