import { Gender } from '@/domain/entities/survivor';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class InventoryItem {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  itemId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateSurvivorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  age: number;

  @ApiProperty()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    type: InventoryItem,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryItem)
  inventoryItems: InventoryItem[];
}
