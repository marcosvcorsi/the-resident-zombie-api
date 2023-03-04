import { Injectable } from '@nestjs/common';
import { Survivor } from '../../../../domain/entities/survivor';
import {
  CountAllSurvivorsParams,
  CountAllSurvivorsRepository,
  CreateSurvivorParams,
  CreateSurvivorRepository,
  DeleteSurvivorRepository,
  FindAllSurvivorsParams,
  FindAllSurvivorsRepository,
  FindSurvivorRepository,
  UpdateSurvivorParams,
  UpdateSurvivorRepository,
} from '../../../../domain/contracts/repositories/survivor';
import { PrismaSurvivorsMapper } from '../mappers/survivor.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSurvivorsRepository
  implements
    CreateSurvivorRepository,
    UpdateSurvivorRepository,
    FindSurvivorRepository,
    FindAllSurvivorsRepository,
    CountAllSurvivorsRepository,
    DeleteSurvivorRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async find(id: string): Promise<Survivor | null> {
    const survivor = await this.prismaService.survivor.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return survivor ? PrismaSurvivorsMapper.toDomain(survivor) : null;
  }

  async findAll({ page, limit }: FindAllSurvivorsParams): Promise<Survivor[]> {
    const survivors = await this.prismaService.survivor.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        infectedAt: null,
      },
    });

    return survivors.map(PrismaSurvivorsMapper.toDomain);
  }

  async count({ infected }: CountAllSurvivorsParams = {}): Promise<number> {
    if (infected) {
      return this.prismaService.survivor.count({
        where: {
          infectedAt: {
            not: null,
          },
        },
      });
    }

    return this.prismaService.survivor.count();
  }

  async create({
    inventoryItems,
    ...rest
  }: CreateSurvivorParams): Promise<Survivor> {
    const survivor = await this.prismaService.survivor.create({
      data: {
        ...rest,
        inventoryItems: {
          createMany: {
            data: inventoryItems.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
            })),
          },
        },
      },
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return PrismaSurvivorsMapper.toDomain(survivor);
  }

  async update(id: string, data: UpdateSurvivorParams): Promise<Survivor> {
    const survivor = await this.prismaService.survivor.update({
      where: {
        id,
      },
      data,
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return PrismaSurvivorsMapper.toDomain(survivor);
  }

  async delete(id: string): Promise<Survivor> {
    const survivor = await this.prismaService.survivor.delete({
      where: {
        id,
      },
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return PrismaSurvivorsMapper.toDomain(survivor);
  }
}
