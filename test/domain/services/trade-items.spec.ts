import {
  DeleteInventoryItemRepository,
  OpenInventoryItemTransaction,
  SaveInventoryItemRepository,
} from '@/domain/contracts/repositories/inventory-item';
import { FindSurvivorRepository } from '@/domain/contracts/repositories/survivor';
import { NotFoundError, ServerError } from '@/domain/errors';
import { TradeItemsService } from '@/domain/services/trade-items';
import { mock, MockProxy } from 'jest-mock-extended';
import { mockSurvivor } from '../../../test/mocks';

describe('TradeItemsService', () => {
  let tradeItemsService: TradeItemsService;
  let survivorsRepository: MockProxy<FindSurvivorRepository>;
  let inventoryItemsRepository: MockProxy<
    SaveInventoryItemRepository &
      DeleteInventoryItemRepository &
      OpenInventoryItemTransaction
  >;

  const input = {
    requesterId: 'any_requester_id',
    receiverId: 'any_receiver_id',
    requesterTradeItems: [
      {
        itemId: 'any_requester_item_id',
        quantity: 1,
      },
    ],
    receiverTradeItems: [
      {
        itemId: 'any_receiver_item_id',
        quantity: 1,
      },
    ],
  };

  const requesterSurvivor = mockSurvivor({
    id: input.requesterId,
    inventoryItems: [
      {
        item: {
          id: input.requesterTradeItems[0].itemId,
          name: 'any_name',
          points: 1,
        },
        quantity: input.requesterTradeItems[0].quantity,
        createdAt: new Date(),
      },
    ],
  });

  const receiverSurvivor = mockSurvivor({
    id: input.receiverId,
    inventoryItems: [
      {
        item: {
          id: input.receiverTradeItems[0].itemId,
          name: 'any_name',
          points: 1,
        },
        quantity: input.receiverTradeItems[0].quantity,
        createdAt: new Date(),
      },
    ],
  });

  beforeAll(() => {
    survivorsRepository = mock();
    inventoryItemsRepository = mock();
  });

  beforeEach(() => {
    survivorsRepository.find.mockReset();
    survivorsRepository.find
      .mockResolvedValueOnce(requesterSurvivor)
      .mockResolvedValueOnce(receiverSurvivor);

    tradeItemsService = new TradeItemsService(
      survivorsRepository,
      inventoryItemsRepository,
    );
  });

  it('should throw an error if requester does not exits', async () => {
    survivorsRepository.find.mockReset();
    survivorsRepository.find.mockResolvedValueOnce(null);

    await expect(tradeItemsService.execute(input)).rejects.toThrow(
      new NotFoundError('Requester'),
    );
  });

  it('should throw an error if receiver does not exits', async () => {
    survivorsRepository.find.mockReset();
    survivorsRepository.find
      .mockResolvedValueOnce(requesterSurvivor)
      .mockResolvedValueOnce(null);

    await expect(tradeItemsService.execute(input)).rejects.toThrow(
      new NotFoundError('Receiver'),
    );
  });

  it('should throw an error if requester and receiver are the same', async () => {
    survivorsRepository.find.mockReset();
    survivorsRepository.find
      .mockResolvedValueOnce(requesterSurvivor)
      .mockResolvedValueOnce(requesterSurvivor);

    await expect(tradeItemsService.execute(input)).rejects.toThrow(
      new ServerError('You cannot trade with yourself'),
    );
  });

  it('should throw if requester item id does not exists', async () => {
    await expect(
      tradeItemsService.execute({
        ...input,
        requesterTradeItems: [
          {
            itemId: 'invalid_id',
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow(
      new ServerError(
        'Item invalid_id is not in the survivor any_requester_id inventory',
      ),
    );
  });

  it('should throw if receiver item id does not exists', async () => {
    await expect(
      tradeItemsService.execute({
        ...input,
        receiverTradeItems: [
          {
            itemId: 'invalid_id',
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow(
      new ServerError(
        'Item invalid_id is not in the survivor any_receiver_id inventory',
      ),
    );
  });

  it('should throw if requester item id does not match quantity', async () => {
    await expect(
      tradeItemsService.execute({
        ...input,
        requesterTradeItems: [
          {
            itemId: 'any_requester_item_id',
            quantity: 2,
          },
        ],
      }),
    ).rejects.toThrow(
      new ServerError(
        'Item any_requester_item_id quantity does match the inventory quantity',
      ),
    );
  });

  it('should throw if receiver item id does not match quantity', async () => {
    await expect(
      tradeItemsService.execute({
        ...input,
        receiverTradeItems: [
          {
            itemId: 'any_receiver_item_id',
            quantity: 2,
          },
        ],
      }),
    ).rejects.toThrow(
      new ServerError(
        'Item any_receiver_item_id quantity does match the inventory quantity',
      ),
    );
  });

  it('should throw if trade items points does not match', async () => {
    survivorsRepository.find.mockReset();
    survivorsRepository.find
      .mockResolvedValueOnce({
        ...requesterSurvivor,
        inventoryItems: [
          {
            item: {
              id: input.requesterTradeItems[0].itemId,
              name: 'any_name',
              points: 1,
            },
            quantity: input.requesterTradeItems[0].quantity,
            createdAt: new Date(),
          },
          {
            item: {
              id: 'any_item_id',
              name: 'any_name',
              points: 2,
            },
            quantity: 2,
            createdAt: new Date(),
          },
        ],
      })
      .mockResolvedValueOnce(receiverSurvivor);

    await expect(
      tradeItemsService.execute({
        ...input,
        requesterTradeItems: [
          {
            itemId: 'any_requester_item_id',
            quantity: 1,
          },
          {
            itemId: 'any_item_id',
            quantity: 1,
          },
        ],
      }),
    ).rejects.toThrow(new ServerError('Trade points does not match'));
  });

  it('should trade items and return requester and receiver', async () => {
    const response = await tradeItemsService.execute(input);

    expect(inventoryItemsRepository.delete).toHaveBeenCalledTimes(2);
    expect(response.receiver).toMatchObject({
      inventoryItems: expect.arrayContaining([
        requesterSurvivor.inventoryItems[0],
      ]),
    });
    expect(response.requester).toMatchObject({
      inventoryItems: expect.arrayContaining([
        receiverSurvivor.inventoryItems[0],
      ]),
    });
  });

  it('should trade items with more quantity and return requester and receiver', async () => {
    survivorsRepository.find.mockReset();
    survivorsRepository.find
      .mockResolvedValueOnce({
        ...requesterSurvivor,
        inventoryItems: [
          {
            item: {
              id: input.requesterTradeItems[0].itemId,
              name: 'any_name',
              points: 1,
            },
            quantity: input.requesterTradeItems[0].quantity + 1,
            createdAt: new Date(),
          },
        ],
      })
      .mockResolvedValueOnce(receiverSurvivor);

    const response = await tradeItemsService.execute(input);

    expect(inventoryItemsRepository.delete).toHaveBeenCalledTimes(1);
    expect(inventoryItemsRepository.save).toHaveBeenCalledTimes(3);
    expect(response.receiver).toMatchObject({
      inventoryItems: expect.arrayContaining([
        expect.objectContaining({
          item: requesterSurvivor.inventoryItems[0].item,
        }),
      ]),
    });
  });
});
