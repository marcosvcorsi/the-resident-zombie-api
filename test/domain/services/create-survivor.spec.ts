import { CreateSurvivorRepository } from '@/domain/contracts/repositories/survivor';
import { Gender } from '@/domain/entities/survivor';
import { CreateSurvivorService } from '@/domain/services/create-survivor';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockSurvivor } from '../../../test/mocks';

describe('CreateSurvivorService', () => {
  let repository: MockProxy<CreateSurvivorRepository>;
  let service: CreateSurvivorService;

  const input = {
    age: 18,
    gender: Gender.MALE,
    name: 'any name',
    latitude: 1,
    longitude: 1,
    inventory: [
      {
        itemId: 'any_id',
        quantity: 1,
      },
    ],
  };

  beforeAll(() => {
    repository = mock();

    repository.create.mockResolvedValue(mockSurvivor());
  });

  beforeEach(() => {
    service = new CreateSurvivorService(repository);
  });

  it('should call CreateSurvivorRepository with correct input and return', async () => {
    const response = await service.execute(input);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(input);
    expect(response.survivor).toMatchObject({
      ...input,
      inventory: [],
    });
  });

  it('should throw if CreateSurvivorRepository create throws', async () => {
    repository.create.mockRejectedValueOnce(new Error());

    await expect(service.execute(input)).rejects.toThrow();
  });
});
