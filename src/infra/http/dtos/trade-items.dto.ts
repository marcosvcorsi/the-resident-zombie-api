import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TradeItem {
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

export class TradeItemsDto {
  @ApiProperty({
    type: TradeItem,
    isArray: true,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TradeItem)
  requesterTradeItems: TradeItem[];

  @ApiProperty({
    type: TradeItem,
    isArray: true,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TradeItem)
  receiverTradeItems: TradeItem[];
}
