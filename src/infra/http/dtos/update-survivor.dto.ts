import { PickType } from '@nestjs/swagger';
import { CreateSurvivorDto } from './create-survidor.dto';

export class UpdateSurvivorDto extends PickType(CreateSurvivorDto, [
  'latitude',
  'longitude',
] as const) {}
