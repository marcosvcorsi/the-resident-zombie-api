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

class TradeItem {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  itemId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class TradeItemsDto {
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TradeItem)
  requesterTradeItems: TradeItem[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TradeItem)
  receiverTradeItems: TradeItem[];
}
