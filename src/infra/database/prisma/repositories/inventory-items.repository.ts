import {
  DeleteInventoryItemParams,
  DeleteInventoryItemRepository,
  OpenInventoryItemTransaction,
  SaveInventoryItemParams,
  SaveInventoryItemRepository,
} from '@/domain/contracts/repositories/inventory-item';
import {
  GetTotalGroupByItemRepository,
  GetTotalLostPointsRepository,
} from '@/domain/contracts/repositories/item';
import { Injectable } from '@nestjs/common';
import { Prisma, InventoryItem as PrismaInventoryItem } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInventoryItemsRepository
  implements
    SaveInventoryItemRepository,
    DeleteInventoryItemRepository,
    OpenInventoryItemTransaction,
    GetTotalLostPointsRepository,
    GetTotalGroupByItemRepository
{
  private hasTransaction = false;
  private operations: Prisma.PrismaPromise<PrismaInventoryItem>[];

  constructor(private readonly prismaService: PrismaService) {}

  async beginTransaction(): Promise<void> {
    this.operations = [];
    this.hasTransaction = true;
  }

  async commit(): Promise<void> {
    await this.prismaService.$transaction(this.operations);

    this.operations = [];
    this.hasTransaction = false;
  }

  async save({
    survivorId,
    itemId,
    quantity,
  }: SaveInventoryItemParams): Promise<void> {
    const saveOperation = this.prismaService.inventoryItem.upsert({
      where: {
        survivorId_itemId: {
          survivorId,
          itemId,
        },
      },
      create: {
        survivorId,
        itemId,
        quantity,
      },
      update: {
        quantity,
      },
      include: {
        item: true,
      },
    });

    if (!this.hasTransaction) {
      await saveOperation;
    } else {
      this.operations.push(saveOperation);
    }
  }

  async delete({
    survivorId,
    itemId,
  }: DeleteInventoryItemParams): Promise<void> {
    const deleteOperation = this.prismaService.inventoryItem.delete({
      where: {
        survivorId_itemId: {
          survivorId,
          itemId,
        },
      },
      include: {
        item: true,
      },
    });

    if (!this.hasTransaction) {
      await deleteOperation;
    } else {
      this.operations.push(deleteOperation);
    }
  }

  async getTotalLostPoints(): Promise<number> {
    const items = await this.prismaService.item.findMany({
      where: {
        inventoryItems: {
          some: {
            survivor: {
              infectedAt: {
                not: null,
              },
            },
          },
        },
      },
      include: {
        inventoryItems: true,
      },
    });

    return items.reduce((acc, item) => {
      const totalQuantity = item.inventoryItems.reduce(
        (quantity, iv) => quantity + iv.quantity,
        0,
      );

      return acc + item.points * totalQuantity;
    }, 0);
  }

  async getTotalGroupByItem(): Promise<
    { id: string; name: string; total: number }[]
  > {
    const inventoryItems = await this.prismaService.inventoryItem.groupBy({
      by: ['itemId'],
      _sum: {
        quantity: true,
      },
    });

    return Promise.all(
      inventoryItems.map(async (inventoryItem) => {
        const item = await this.prismaService.item.findUnique({
          where: {
            id: inventoryItem.itemId,
          },
        });

        return {
          id: item.id,
          name: item.name,
          total: inventoryItem._sum.quantity,
        };
      }),
    );
  }
}
