import {
  CountReportsBySurvivorRepository,
  CreateReportRepository,
} from '@/domain/contracts/repositories/report';
import {
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '@/domain/contracts/repositories/survivor';
import { NotFoundError } from '@/domain/errors';
import { CreateReportService } from '@/domain/services/create-report';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockReport, mockSurvivor } from '../../../test/mocks';

describe('CreateReportService', () => {
  let createReportService: CreateReportService;
  let survivorsRepository: MockProxy<
    FindSurvivorRepository & UpdateSurvivorRepository
  >;
  let reportsRepository: MockProxy<
    CreateReportRepository & CountReportsBySurvivorRepository
  >;

  const input = {
    survivorId: 'any_id',
  };

  beforeAll(() => {
    survivorsRepository = mock();
    reportsRepository = mock();

    survivorsRepository.find.mockResolvedValue(mockSurvivor());
    survivorsRepository.update.mockResolvedValue(mockSurvivor());

    reportsRepository.create.mockResolvedValue(mockReport());
    reportsRepository.countBySurvivor.mockResolvedValue(0);
  });

  beforeEach(() => {
    createReportService = new CreateReportService(
      survivorsRepository,
      reportsRepository,
    );
  });

  it('should throw an error if survivor does not exists', async () => {
    survivorsRepository.find.mockResolvedValueOnce(null);

    await expect(createReportService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should be able to create a new report and return', async () => {
    const response = await createReportService.execute(input);

    expect(survivorsRepository.find).toHaveBeenCalledWith(input.survivorId);
    expect(reportsRepository.create).toHaveBeenCalledTimes(1);
    expect(reportsRepository.create).toHaveBeenCalledWith(input);
    expect(reportsRepository.countBySurvivor).toHaveBeenCalled();
    expect(response.report).toMatchObject({
      survivor: { id: input.survivorId },
    });
  });

  it('should be able to create a new report and update survivor to infected', async () => {
    reportsRepository.countBySurvivor.mockResolvedValueOnce(5);

    const response = await createReportService.execute(input);

    expect(survivorsRepository.find).toHaveBeenCalledWith(input.survivorId);
    expect(reportsRepository.create).toHaveBeenCalledWith(input);
    expect(reportsRepository.countBySurvivor).toHaveBeenCalled();
    expect(survivorsRepository.update).toHaveBeenCalledWith(input.survivorId, {
      infectedAt: expect.any(Date),
    });
    expect(response.report).toMatchObject({
      survivor: { id: input.survivorId },
    });
  });

  it('should be able to create a new report and not update survivor to infected', async () => {
    reportsRepository.countBySurvivor.mockResolvedValueOnce(5);
    survivorsRepository.find.mockResolvedValueOnce(
      mockSurvivor({ infectedAt: new Date() }),
    );

    const response = await createReportService.execute(input);

    expect(survivorsRepository.find).toHaveBeenCalledWith(input.survivorId);
    expect(reportsRepository.create).toHaveBeenCalledWith(input);
    expect(reportsRepository.countBySurvivor).not.toHaveBeenCalled();
    expect(survivorsRepository.update).not.toHaveBeenCalled();
    expect(response.report).toMatchObject({
      survivor: { id: input.survivorId },
    });
  });
});
