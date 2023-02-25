import { Survivor } from '../../../../domain/entities/survivor';
import { Survivor as PrismaSurvivor } from '@prisma/client';

export class PrismaSurvivorsMapper {
  static toDomain(survivor: PrismaSurvivor): Survivor {
    return {
      id: survivor.id,
      age: survivor.age,
      gender: survivor.gender,
      latitude: survivor.latitude,
      longitude: survivor.longitude,
      name: survivor.name,
    };
  }
}
