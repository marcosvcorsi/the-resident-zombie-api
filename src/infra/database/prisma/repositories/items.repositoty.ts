import {
  CountAllItemsRepository,
  FindAllItemsParams,
  FindAllItemsRepository,
} from '@/domain/contracts/repositories/item';
import { Item } from '@/domain/entities/item';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaItemsRepository
  implements CountAllItemsRepository, FindAllItemsRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return this.prismaService.item.count();
  }

  async findAll({ page, limit }: FindAllItemsParams): Promise<Item[]> {
    const items = await this.prismaService.item.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        points: 'desc',
      },
    });

    return items;
  }
}
