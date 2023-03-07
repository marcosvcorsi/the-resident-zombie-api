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
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Item } from './item';

@ObjectType()
class InventoryItem {
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

  @Field(() => [InventoryItem])
  inventoryItems: InventoryItem[];
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
export class CreateSurvivorInventoryItemInput {
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

  @Field(() => [CreateSurvivorInventoryItemInput])
  @ValidateNested({ each: true })
  inventoryItems: CreateSurvivorInventoryItemInput[];
}

@InputType()
export class TradeItemInput {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  @Field()
  itemId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Field()
  quantity: number;
}

@InputType()
export class CreateTradeInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  @Field()
  receiverId: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Field(() => [TradeItemInput])
  requesterTradeItems: TradeItemInput[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Field(() => [TradeItemInput])
  receiverTradeItems: TradeItemInput[];
}

@ObjectType()
export class Trade {
  @Field(() => Survivor)
  receiver: Survivor;

  @Field(() => Survivor)
  requester: Survivor;
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
