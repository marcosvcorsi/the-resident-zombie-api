import { Injectable } from '@nestjs/common';
import { Survivor } from '../../../../domain/entities/survivor';
import {
  CreateSurvivorParams,
  CreateSurvivorRepository,
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '../../../../domain/contracts/repositories/survivor';
import { PrismaSurvivorsMapper } from '../mappers/survivor.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSurvivorsRepository
  implements
    CreateSurvivorRepository,
    UpdateSurvivorRepository,
    FindSurvivorRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async find(id: string): Promise<Survivor | null> {
    const survivor = await this.prismaService.survivor.findUnique({
      where: {
        id,
      },
    });

    return survivor ? PrismaSurvivorsMapper.toDomain(survivor) : null;
  }

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
