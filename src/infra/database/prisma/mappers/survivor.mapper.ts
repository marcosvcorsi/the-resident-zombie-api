import { Gender, Survivor } from '../../../../domain/entities/survivor';
import {
  InventoryItem as PrismaInventoryItem,
  Item as PrismaItem,
  Survivor as PrismaSurvivor,
} from '@prisma/client';

type InventoryItem = PrismaInventoryItem & { item: PrismaItem };

export class PrismaSurvivorsMapper {
  static toDomain(
    survivor: PrismaSurvivor & {
      inventoryItems: InventoryItem[];
    },
  ): Survivor {
    return {
      id: survivor.id,
      age: survivor.age,
      gender: survivor.gender as Gender,
      latitude: survivor.latitude,
      longitude: survivor.longitude,
      name: survivor.name,
      createdAt: survivor.createdAt,
      updatedAt: survivor.updatedAt,
      inventoryItems: survivor.inventoryItems.map((inv) => ({
        item: inv.item,
        quantity: inv.quantity,
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
      })),
    };
  }
}
