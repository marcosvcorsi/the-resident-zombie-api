import {
  ArgsType,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
export class CreateSurvivorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  age: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

@InputType()
export class UpdateSurvivorInput {
  @Field(() => ID)
  @IsUUID('4')
  id: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
