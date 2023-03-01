import { Report } from '@/domain/entities/report';

export type CreateReportParams = {
  survivorId: string;
};

export interface CreateReportRepository {
  create(data: CreateReportParams): Promise<Report>;
}

export type CountReportsBySurvivorParams = {
  survivorId: string;
};

export interface CountReportsBySurvivorRepository {
  countBySurvivor(data: CountReportsBySurvivorParams): Promise<number>;
}
