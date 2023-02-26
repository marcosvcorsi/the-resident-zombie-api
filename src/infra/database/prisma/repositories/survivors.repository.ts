import { Injectable } from '@nestjs/common';
import { Survivor } from '../../../../domain/entities/survivor';
import {
  CreateSurvivorParams,
  CreateSurvivorRepository,
  UpdateSurvivorRepository,
} from '../../../../domain/contracts/repositories/survivor';
import { PrismaSurvivorsMapper } from '../mappers/survivor.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSurvivorsRepository
  implements CreateSurvivorRepository, UpdateSurvivorRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateSurvivorParams): Promise<Survivor> {
    const survivor = await this.prismaService.survivor.create({
      data,
    });

    return PrismaSurvivorsMapper.toDomain(survivor);
  }

  async update(
    id: string,
    data: Partial<Omit<Survivor, 'id'>>,
  ): Promise<Survivor> {
    const survivor = await this.prismaService.survivor.update({
      where: {
        id,
      },
      data,
    });

    return PrismaSurvivorsMapper.toDomain(survivor);
  }
}
