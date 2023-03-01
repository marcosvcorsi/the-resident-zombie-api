import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Survivor } from './survivor';

@ObjectType()
export class Report {
  @Field(() => ID)
  id: string;

  @Field(() => Survivor)
  survivor: Survivor;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateSurvivorReportInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  survivorId: string;
}
