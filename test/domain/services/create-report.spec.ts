import {
  CountReportsBySurvivorRepository,
  CreateReportRepository,
  FindUniqueReportRepository,
} from '@/domain/contracts/repositories/report';
import {
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '@/domain/contracts/repositories/survivor';
import { NotFoundError, ServerError } from '@/domain/errors';
import { CreateReportService } from '@/domain/services/create-report';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockReport, mockSurvivor } from '../../../test/mocks';

describe('CreateReportService', () => {
  let createReportService: CreateReportService;
  let survivorsRepository: MockProxy<
    FindSurvivorRepository & UpdateSurvivorRepository
  >;
  let reportsRepository: MockProxy<
    CreateReportRepository &
      CountReportsBySurvivorRepository &
      FindUniqueReportRepository
  >;

  const input = {
    survivorId: 'any_id',
    reporterId: 'any_reporter_id',
  };

  beforeAll(() => {
    survivorsRepository = mock();
    reportsRepository = mock();

    survivorsRepository.find
      .mockResolvedValue(mockSurvivor())
      .mockResolvedValue(mockSurvivor({ id: 'any_reporter_id' }));
    survivorsRepository.update.mockResolvedValue(mockSurvivor());

    reportsRepository.create.mockResolvedValue(mockReport());
    reportsRepository.findUnique.mockResolvedValue(null);
    reportsRepository.countBySurvivor.mockResolvedValue(0);
  });

  beforeEach(() => {
    createReportService = new CreateReportService(
      survivorsRepository,
      reportsRepository,
    );
  });

  it('should throw an error if reporter does not exists', async () => {
    survivorsRepository.find.mockResolvedValueOnce(null);

    await expect(createReportService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should throw an error if reporter is infected', async () => {
    survivorsRepository.find.mockResolvedValueOnce(
      mockSurvivor({ infectedAt: new Date() }),
    );

    await expect(createReportService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should throw an error if survivor does not exists', async () => {
    survivorsRepository.find
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockSurvivor());

    await expect(createReportService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should throw an error if survivor is already infected', async () => {
    survivorsRepository.find
      .mockResolvedValueOnce(mockSurvivor({ infectedAt: new Date() }))
      .mockResolvedValueOnce(mockSurvivor());

    await expect(createReportService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should throw an error if reporter is equal to survivor', async () => {
    await expect(
      createReportService.execute({
        ...input,
        reporterId: input.survivorId,
      }),
    ).rejects.toBeInstanceOf(ServerError);
  });

  it('should throw an error if report already exists', async () => {
    reportsRepository.findUnique.mockResolvedValueOnce(mockReport());

    await expect(createReportService.execute(input)).rejects.toBeInstanceOf(
      ServerError,
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
});
