import { Report } from '@/domain/entities/report';
import {
  InventoryItem as PrismaInventoryItem,
  Item as PrismaItem,
  Report as PrismaReport,
  Survivor as PrismaSurvivor,
} from '@prisma/client';
import { PrismaSurvivorsMapper } from './survivor.mapper';

type InventoryItem = PrismaInventoryItem & { item: PrismaItem };
type Survivor = PrismaSurvivor & { inventoryItems: InventoryItem[] };

export class PrismaReportsMapper {
  static toDomain(
    report: PrismaReport & {
      survivor: Survivor;
    } & { reporter: Survivor },
  ): Report {
    const { survivor, reporter } = report;

    return {
      ...report,
      survivor: PrismaSurvivorsMapper.toDomain(survivor),
      reporter: PrismaSurvivorsMapper.toDomain(reporter),
    };
  }
}
