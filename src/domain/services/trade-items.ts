import {
  DeleteInventoryItemRepository,
  SaveInventoryItemRepository,
} from '../contracts/repositories/inventory-item';
import { FindSurvivorRepository } from '../contracts/repositories/survivor';
import { InventoryItem } from '../entities/inventory-item';
import { Survivor } from '../entities/survivor';
import { NotFoundError, ServerError } from '../errors';

type ItemCompose = {
  updatedInventoryItem: InventoryItem;
  newInventoryItem: InventoryItem;
  requester: Survivor;
  receiver: Survivor;
};

type TradeItem = {
  itemId: string;
  quantity: number;
};

export type TradeItemsInput = {
  requesterId: string;
  receiverId: string;
  requesterTradeItems: TradeItem[];
  receiverTradeItems: TradeItem[];
};

export type TradeItemsOutput = {
  requester: Survivor;
  receiver: Survivor;
};

export class TradeItemsService {
  constructor(
    private readonly survivorsRepository: FindSurvivorRepository,
    private readonly inventoryItemsRepository: SaveInventoryItemRepository &
      DeleteInventoryItemRepository,
  ) {}

  private async getAndValidateSurvivor(id: string, field: string) {
    const survivor = await this.survivorsRepository.find(id);

    if (!survivor || survivor.infectedAt) {
      throw new NotFoundError(field);
    }

    return survivor;
  }

  private mountItems(
    tradeInventoryItems: TradeItem[],
    requester: Survivor,
    receiver: Survivor,
  ) {
    return tradeInventoryItems.map((tradeInventoryItem) => {
      const { itemId, quantity } = tradeInventoryItem;

      const inventoryItem = requester.inventoryItems.find(
        ({ item }) => item.id === itemId,
      );

      if (!inventoryItem) {
        throw new ServerError(
          `Item ${itemId} is not in the survivor ${requester.id} inventory`,
        );
      }

      if (quantity > inventoryItem.quantity) {
        throw new ServerError(
          `Item ${itemId} quantity does match the inventory quantity`,
        );
      }

      const receiverInventoryItem = receiver.inventoryItems.find(
        ({ item }) => item.id === itemId,
      );

      return {
        updatedInventoryItem: {
          ...inventoryItem,
          quantity: inventoryItem.quantity - quantity,
        },
        newInventoryItem: {
          ...inventoryItem,
          quantity: (receiverInventoryItem?.quantity ?? 0) + quantity,
        },
        requester,
        receiver,
      };
    });
  }

  private getTotalPoints(itemComposeList: ItemCompose[]) {
    return itemComposeList.reduce((acc, itemCompose) => {
      const { newInventoryItem, updatedInventoryItem } = itemCompose;
      const { quantity } = newInventoryItem;
      const { item } = updatedInventoryItem;

      return acc + quantity * item.points;
    }, 0);
  }

  private async saveItems(items: ItemCompose[]) {
    const receiverItemsInserted: InventoryItem[] = [];
    const requesterItemsUpdated: InventoryItem[] = [];

    for (const item of items) {
      const { newInventoryItem, updatedInventoryItem, requester, receiver } =
        item;

      const [updatedItem, newItem] = await Promise.all([
        item.updatedInventoryItem.quantity
          ? this.inventoryItemsRepository.save({
              itemId: updatedInventoryItem.item.id,
              survivorId: requester.id,
              quantity: updatedInventoryItem.quantity,
            })
          : this.inventoryItemsRepository.delete({
              itemId: updatedInventoryItem.item.id,
              survivorId: requester.id,
            }),
        this.inventoryItemsRepository.save({
          itemId: newInventoryItem.item.id,
          quantity: newInventoryItem.quantity,
          survivorId: receiver.id,
        }),
      ]);

      receiverItemsInserted.push(newItem);

      if (updatedInventoryItem.quantity) {
        requesterItemsUpdated.push(updatedItem);
      }
    }

    return { receiverItemsInserted, requesterItemsUpdated };
  }

  mountSurvivor(
    survivor: Survivor,
    updatedInventoryItems: InventoryItem[],
    insertedInventoryItems: InventoryItem[],
  ): Survivor {
    return {
      ...survivor,
      inventoryItems: [...updatedInventoryItems, ...insertedInventoryItems],
    };
  }

  async execute({
    requesterId,
    receiverId,
    requesterTradeItems,
    receiverTradeItems,
  }: TradeItemsInput): Promise<TradeItemsOutput> {
    const requester = await this.getAndValidateSurvivor(
      requesterId,
      'Requester',
    );

    const receiver = await this.getAndValidateSurvivor(receiverId, 'Receiver');

    if (requester.id === receiver.id) {
      throw new ServerError('You cannot trade with yourself');
    }

    const requesterItems = this.mountItems(
      requesterTradeItems,
      requester,
      receiver,
    );

    const receiverItems = this.mountItems(
      receiverTradeItems,
      receiver,
      requester,
    );

    const requesterPoints = this.getTotalPoints(requesterItems);
    const receiverPoints = this.getTotalPoints(receiverItems);

    if (requesterPoints !== receiverPoints) {
      throw new ServerError('Trade points does not match');
    }

    const newRequesterItems = await this.saveItems(requesterItems);
    const newReceiverItems = await this.saveItems(receiverItems);

    return {
      requester: this.mountSurvivor(
        requester,
        newRequesterItems.requesterItemsUpdated,
        newReceiverItems.receiverItemsInserted,
      ),
      receiver: this.mountSurvivor(
        receiver,
        newReceiverItems.requesterItemsUpdated,
        newRequesterItems.receiverItemsInserted,
      ),
    };
  }
}
