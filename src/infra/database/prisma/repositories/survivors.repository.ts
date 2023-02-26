import { Injectable } from '@nestjs/common';
import { Survivor } from '../../../../domain/entities/survivor';
import {
  CreateSurvivorParams,
  CreateSurvivorRepository,
} from '../../../../domain/contracts/repositories/survivor';
import { PrismaSurvivorsMapper } from '../mappers/survivor.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSurvivorsRepository implements CreateSurvivorRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateSurvivorParams): Promise<Survivor> {
    const survivor = await this.prismaService.survivor.create({
      data,
    });

    return PrismaSurvivorsMapper.toDomain(survivor);
  }
}
