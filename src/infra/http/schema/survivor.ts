import { Gender } from '@/domain/entities/survivor';
import {
  ArgsType,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Item } from './item';

@ObjectType()
class Inventory {
  @Field(() => Item)
  item: Item;

  @Field(() => Int)
  quantity: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class Survivor {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  gender: string;

  @Field()
  age: number;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => [Inventory])
  inventory: Inventory[];
}

@ObjectType()
export class PaginatedSurvivorResponse {
  @Field()
  total: number;

  @Field(() => [Survivor])
  data: Survivor[];
}

@ArgsType()
export class SurvivorsArgs {
  @Field(() => Int, { defaultValue: 20 })
  first: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}

@InputType()
export class CreateSurvivorInventoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  itemId: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

@InputType()
export class CreateSurvivorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @Field()
  @IsInt()
  @IsNotEmpty()
  age: number;

  @Field()
  @IsNumber()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @Field()
  @IsNumber()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @Field(() => [CreateSurvivorInventoryInput])
  @ValidateNested({ each: true })
  inventory: CreateSurvivorInventoryInput[];
}

@InputType()
export class UpdateSurvivorInput {
  @Field(() => ID)
  @IsUUID('4')
  id: string;

  @Field()
  @IsNumber()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @Field()
  @IsNumber()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}
