import { GetMetricsService } from '@/domain/services/get-metrics';
import { Query, Resolver } from '@nestjs/graphql';
import { Dashboard } from '../schema/dashboard';

@Resolver()
export class DashboardResolver {
  constructor(private readonly getMetricsService: GetMetricsService) {}

  @Query(() => Dashboard)
  async dashboard() {
    return this.getMetricsService.execute();
  }
}
