import { CreateReportService } from '@/domain/services/create-report';
import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateSurvivorReportInput, Report } from '../schema/report';

@Resolver()
export class ReportsResolver {
  constructor(private readonly createReportService: CreateReportService) {}

  @Mutation(() => Report)
  async createSurvivorReport(
    @Args('input') input: CreateSurvivorReportInput,
    @Context() ctx: any,
  ) {
    const reporterId = ctx.req.headers.authorization as string;

    if (!reporterId) {
      throw new UnauthorizedException();
    }

    const { report } = await this.createReportService.execute({
      ...input,
      reporterId,
    });

    return report;
  }
}
