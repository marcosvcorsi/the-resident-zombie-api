import { Report } from '@/domain/entities/report';
import { Gender } from '@/domain/entities/survivor';
import {
  Inventory as PrismaInventory,
  Item as PrismaItem,
  Report as PrismaReport,
  Survivor as PrismaSurvivor,
} from '@prisma/client';

type Inventory = PrismaInventory & { item: PrismaItem };

export class PrismaReportsMapper {
  static toDomain(
    report: PrismaReport & {
      survivor: PrismaSurvivor & { inventory: Inventory[] };
    },
  ): Report {
    const { survivor } = report;

    return {
      ...report,
      survivor: {
        ...survivor,
        gender: survivor.gender as Gender,
        inventory: survivor.inventory.map((inv) => ({
          item: inv.item,
          createdAt: inv.createdAt,
          quantity: inv.quantity,
          updatedAt: inv.updatedAt,
        })),
      },
    };
  }
}
