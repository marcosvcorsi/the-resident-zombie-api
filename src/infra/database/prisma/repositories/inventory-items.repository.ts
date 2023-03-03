import {
  DeleteInventoryItemParams,
  DeleteInventoryItemRepository,
  SaveInventoryItemParams,
  SaveInventoryItemRepository,
} from '@/domain/contracts/repositories/inventory-item';
import { InventoryItem } from '@/domain/entities/inventory-item';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInventoryItemsRepository
  implements SaveInventoryItemRepository, DeleteInventoryItemRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async save({
    survivorId,
    itemId,
    quantity,
  }: SaveInventoryItemParams): Promise<InventoryItem> {
    return this.prismaService.inventoryItem.upsert({
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
  }

  async delete({
    survivorId,
    itemId,
  }: DeleteInventoryItemParams): Promise<InventoryItem> {
    return this.prismaService.inventoryItem.delete({
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
  }
}
