import { inventoryRepository, IInventoryRepository } from "../repositories/inventory.repository";
import { ReserveStockItem } from "../dtos/inventory.dto";
import { logAudit } from "@/core/logger";

export class StockReservationService {
  constructor(private inventoryRepo: IInventoryRepository = inventoryRepository) {}

  /**
   * Atomically locks stock during a checkout session to prevent double-selling.
   */
  async reserveCheckoutItems(items: ReserveStockItem[]): Promise<void> {
    await this.inventoryRepo.reserveStockBatch(items);
    logAudit("INVENTORY_ITEMS_RESERVED", { itemsCount: items.length });
  }

  /**
   * Releases locked stock back to available pool if payment fails or session expires.
   */
  async releaseCheckoutItems(items: ReserveStockItem[]): Promise<void> {
    await this.inventoryRepo.releaseStockBatch(items);
    logAudit("INVENTORY_ITEMS_RELEASED", { itemsCount: items.length });
  }

  /**
   * Permanently deducts stock on successful payment capture.
   */
  async commitOrderFulfillment(items: ReserveStockItem[]): Promise<void> {
    await this.inventoryRepo.finalizeStockDeductionBatch(items);
    logAudit("INVENTORY_ITEMS_COMMITTED_FOR_ORDER", { itemsCount: items.length });
  }
}

export const stockReservationService = new StockReservationService();
