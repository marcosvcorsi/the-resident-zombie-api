import { CreateReportService } from '@/domain/services/create-report';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateSurvivorReportInput, Report } from '../schema/report';

@Resolver()
export class ReportsResolver {
  constructor(private readonly createReportService: CreateReportService) {}

  @Mutation(() => Report)
  async createSurvivorReport(@Args('input') input: CreateSurvivorReportInput) {
    const { report } = await this.createReportService.execute(input);

    return report;
  }
}
