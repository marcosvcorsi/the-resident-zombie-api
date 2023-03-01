import {
  CountReportsBySurvivorParams,
  CountReportsBySurvivorRepository,
  CreateReportParams,
  CreateReportRepository,
} from '@/domain/contracts/repositories/report';
import { Report } from '@/domain/entities/report';
import { Injectable } from '@nestjs/common';
import { PrismaReportsMapper } from '../mappers/report.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaReportsRepository
  implements CreateReportRepository, CountReportsBySurvivorRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateReportParams): Promise<Report> {
    const report = await this.prismaService.report.create({
      data,
      include: {
        survivor: {
          include: {
            inventory: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });

    return PrismaReportsMapper.toDomain(report);
  }
  async countBySurvivor({
    survivorId,
  }: CountReportsBySurvivorParams): Promise<number> {
    return this.prismaService.report.count({
      where: {
        survivorId,
      },
    });
  }
}
