import {
  DeleteSurvivorRepository,
  FindSurvivorRepository,
} from '@/domain/contracts/repositories/survivor';
import { NotFoundError } from '@/domain/errors';
import { DeleteSurvivorService } from '@/domain/services/delete-survivor';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockSurvivor } from '../../../test/mocks';

describe('DeleteSurvivorService', () => {
  let survivorsRepository: MockProxy<
    FindSurvivorRepository & DeleteSurvivorRepository
  >;
  let deleteSurvivorService: DeleteSurvivorService;

  const input = {
    id: 'any_id',
  };

  const survivor = {
    ...mockSurvivor(),
    ...input,
  };

  beforeAll(() => {
    survivorsRepository = mock();

    survivorsRepository.find.mockResolvedValue(survivor);
    survivorsRepository.delete.mockResolvedValue(survivor);
  });

  beforeEach(() => {
    deleteSurvivorService = new DeleteSurvivorService(survivorsRepository);
  });

  it('should throw an SurvivorNotFound error if survivor does not exists', async () => {
    survivorsRepository.find.mockResolvedValueOnce(null);

    await expect(deleteSurvivorService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should delete a survivor and return', async () => {
    const response = await deleteSurvivorService.execute(input);

    expect(survivorsRepository.find).toHaveBeenCalledWith(input.id);
    expect(survivorsRepository.delete).toHaveBeenCalledTimes(1);
    expect(survivorsRepository.delete).toHaveBeenCalledWith(input.id);
    expect(response.survivor).toMatchObject(survivor);
  });

  it('should throw if SurvivorRepository throws', async () => {
    survivorsRepository.find.mockRejectedValueOnce(new Error());

    await expect(deleteSurvivorService.execute(input)).rejects.toThrow();
  });
});
