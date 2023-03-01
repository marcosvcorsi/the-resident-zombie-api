import {
  CountReportsBySurvivorRepository,
  CreateReportRepository,
} from '../contracts/repositories/report';
import {
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '../contracts/repositories/survivor';
import { Report } from '../entities/report';
import { NotFoundError } from '../errors';

export type CreateReportInput = {
  survivorId: string;
};

export type CreateReportOutput = {
  report: Report;
};

const MINIMUM_REPORT_COUNT_TO_INFECT = 5;

export class CreateReportService {
  constructor(
    private readonly survivorsRepository: FindSurvivorRepository &
      UpdateSurvivorRepository,
    private readonly reportsRepository: CreateReportRepository &
      CountReportsBySurvivorRepository,
  ) {}

  async execute({
    survivorId,
  }: CreateReportInput): Promise<CreateReportOutput> {
    const survivor = await this.survivorsRepository.find(survivorId);

    if (!survivor) {
      throw new NotFoundError('Survivor');
    }

    const report = await this.reportsRepository.create({ survivorId });

    if (!survivor.infectedAt) {
      const reportCount = await this.reportsRepository.countBySurvivor({
        survivorId,
      });

      if (reportCount >= MINIMUM_REPORT_COUNT_TO_INFECT) {
        await this.survivorsRepository.update(survivorId, {
          infectedAt: new Date(),
        });
      }
    }

    return { report };
  }
}
