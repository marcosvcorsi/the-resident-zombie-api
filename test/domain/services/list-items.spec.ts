import {
  CountAllItemsRepository,
  FindAllItemsRepository,
} from '@/domain/contracts/repositories/item';
import { ListItemsService } from '@/domain/services/list-items';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockItem } from '../../../test/mocks';

describe('ListItemsService', () => {
  let listItemsService: ListItemsService;
  let itemsRepository: MockProxy<
    CountAllItemsRepository & FindAllItemsRepository
  >;

  const input = {
    page: 1,
    limit: 10,
  };

  const item = mockItem();

  beforeAll(() => {
    itemsRepository = mock();

    itemsRepository.count.mockResolvedValue(1);
    itemsRepository.findAll.mockResolvedValue([item]);
  });

  beforeEach(() => {
    listItemsService = new ListItemsService(itemsRepository);
  });

  it('should return a list and total of items', async () => {
    const response = await listItemsService.execute(input);

    expect(itemsRepository.count).toHaveBeenCalledTimes(1);
    expect(itemsRepository.findAll).toHaveBeenCalledTimes(1);
    expect(itemsRepository.findAll).toHaveBeenCalledWith(input);
    expect(response.total).toBe(1);
    expect(response.items).toEqual([item]);
  });

  it('should throw if ItemsRepository throws', async () => {
    itemsRepository.count.mockRejectedValueOnce(new Error());

    await expect(listItemsService.execute(input)).rejects.toThrow();
  });
});
