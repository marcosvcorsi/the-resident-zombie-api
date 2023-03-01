import { Report } from '@/domain/entities/report';

export type CreateReportParams = {
  survivorId: string;
  reporterId: string;
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

export type FindUniqueReportParams = {
  survivorId: string;
  reporterId: string;
};

export interface FindUniqueReportRepository {
  findUnique(data: FindUniqueReportParams): Promise<Report | null>;
}
