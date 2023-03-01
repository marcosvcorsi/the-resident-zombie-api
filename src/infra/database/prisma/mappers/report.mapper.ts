import { Report } from '@/domain/entities/report';
import {
  Inventory as PrismaInventory,
  Item as PrismaItem,
  Report as PrismaReport,
  Survivor as PrismaSurvivor,
} from '@prisma/client';
import { PrismaSurvivorsMapper } from './survivor.mapper';

type Inventory = PrismaInventory & { item: PrismaItem };
type Survivor = PrismaSurvivor & { inventory: Inventory[] };

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
