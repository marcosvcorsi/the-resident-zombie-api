import { Survivor } from '@prisma/client';
import { FindSurvivorRepository } from '../contracts/repositories/survivor';
import { NotFoundError } from '../errors';

type InventoryItem = {
  inventoryId: string;
  quantity: number;
};

export type TradeItemsInput = {
  requesterId: string;
  receiverId: string;
  requesterInventoryItems: InventoryItem[];
  receiverInventoryItems: InventoryItem[];
};

export type TradeItemsOutput = {
  requester: Survivor;
  receiver: Survivor;
};

export class TradeItemsService {
  constructor(private readonly survivorsRepository: FindSurvivorRepository) {}

  private async getAndValidateSurvivor(id: string, field: string) {
    const survivor = await this.survivorsRepository.find(id);

    if (!survivor || survivor.infectedAt) {
      throw new NotFoundError(field);
    }

    return survivor;
  }

  async execute({
    requesterId,
    receiverId,
    requesterInventoryItems,
    receiverInventoryItems,
  }: TradeItemsInput): Promise<TradeItemsOutput> {
    const requester = await this.getAndValidateSurvivor(
      requesterId,
      'Requester',
    );
    const receiver = await this.getAndValidateSurvivor(receiverId, 'Receiver');

    return null;
  }
}
