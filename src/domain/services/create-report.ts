import {
  CountReportsBySurvivorRepository,
  CreateReportRepository,
  FindUniqueReportRepository,
} from '../contracts/repositories/report';
import {
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '../contracts/repositories/survivor';
import { Report } from '../entities/report';
import { NotFoundError, ServerError } from '../errors';

export type CreateReportInput = {
  survivorId: string;
  reporterId: string;
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
      CountReportsBySurvivorRepository &
      FindUniqueReportRepository,
  ) {}

  async execute({
    survivorId,
    reporterId,
  }: CreateReportInput): Promise<CreateReportOutput> {
    const reporter = await this.survivorsRepository.find(reporterId);

    if (!reporter) {
      throw new NotFoundError('Reporter');
    }

    const survivor = await this.survivorsRepository.find(survivorId);

    if (!survivor) {
      throw new NotFoundError('Survivor');
    }

    if (survivorId === reporterId) {
      throw new ServerError('You cannot report yourself');
    }

    const existingReport = await this.reportsRepository.findUnique({
      survivorId,
      reporterId,
    });

    if (existingReport) {
      throw new ServerError('Report already exists');
    }

    const report = await this.reportsRepository.create({
      survivorId,
      reporterId,
    });

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
