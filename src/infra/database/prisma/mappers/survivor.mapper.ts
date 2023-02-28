import { Gender, Survivor } from '../../../../domain/entities/survivor';
import {
  Inventory as PrismaInventory,
  Item as PrismaItem,
  Survivor as PrismaSurvivor,
} from '@prisma/client';

type Inventory = PrismaInventory & { item: PrismaItem };

export class PrismaSurvivorsMapper {
  static toDomain(
    survivor: PrismaSurvivor & {
      inventory: Inventory[];
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
      inventory: survivor.inventory?.map((inv) => ({
        item: inv.item,
        quantity: inv.quantity,
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
      })),
    };
  }
}
