import { CreateSurvivorRepository } from '../../../src/domain/contracts/repositories/survivor';
import { CreateSurvivorService } from '../../../src/domain/services/create-survivor';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateSurvivorService', () => {
  let repository: MockProxy<CreateSurvivorRepository>;
  let service: CreateSurvivorService;

  const input = {
    age: 18,
    gender: 'male',
    name: 'any_name',
    latitude: 1,
    longitude: 1,
  };

  beforeAll(() => {
    repository = mock();

    repository.create.mockResolvedValue({
      id: 'any_id',
      ...input,
    });
  });

  beforeEach(() => {
    service = new CreateSurvivorService(repository);
  });

  it('should call CreateSurvivorRepository with correct input and return', async () => {
    const response = await service.execute(input);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(input);
    expect(response.survivor).toMatchObject(input);
  });

  it('should throw if CreateSurvivorRepository create throws', async () => {
    repository.create.mockRejectedValueOnce(new Error());

    await expect(service.execute(input)).rejects.toThrow();
  });
});
