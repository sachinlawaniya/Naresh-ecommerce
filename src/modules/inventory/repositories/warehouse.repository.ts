import { prisma } from "@/lib/prisma";
import { Warehouse, Prisma } from "@prisma/client";

export interface IWarehouseRepository {
  findById(id: string): Promise<Warehouse | null>;
  findByCode(code: string): Promise<Warehouse | null>;
  listAll(): Promise<Warehouse[]>;
  create(data: Prisma.WarehouseCreateInput): Promise<Warehouse>;
  update(id: string, data: Prisma.WarehouseUpdateInput): Promise<Warehouse>;
  getDefaultWarehouse(): Promise<Warehouse | null>;
}

export class WarehouseRepository implements IWarehouseRepository {
  async findById(id: string): Promise<Warehouse | null> {
    return prisma.warehouse.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Warehouse | null> {
    return prisma.warehouse.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async listAll(): Promise<Warehouse[]> {
    return prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.WarehouseCreateInput): Promise<Warehouse> {
    return prisma.warehouse.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }

  async update(id: string, data: Prisma.WarehouseUpdateInput): Promise<Warehouse> {
    return prisma.warehouse.update({
      where: { id },
      data,
    });
  }

  async getDefaultWarehouse(): Promise<Warehouse | null> {
    return prisma.warehouse.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  }
}

export const warehouseRepository = new WarehouseRepository();
