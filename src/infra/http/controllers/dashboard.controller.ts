import { GetMetricsService } from '@/domain/services/get-metrics';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DashboardViewModel } from '../views/dashboard.view';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getMetricsService: GetMetricsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: DashboardViewModel,
  })
  async getDashboard() {
    return this.getMetricsService.execute();
  }
}
