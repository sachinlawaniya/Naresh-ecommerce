import { prisma } from "@/lib/prisma";
import { Address, Prisma } from "@prisma/client";

export interface IAddressRepository {
  findById(id: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  create(userId: string, data: Prisma.AddressCreateWithoutUserInput): Promise<Address>;
  update(id: string, userId: string, data: Prisma.AddressUpdateInput): Promise<Address>;
  delete(id: string, userId: string): Promise<Address>;
  clearDefaultBilling(userId: string): Promise<void>;
  clearDefaultShipping(userId: string): Promise<void>;
}

export class AddressRepository implements IAddressRepository {
  async findById(id: string): Promise<Address | null> {
    return prisma.address.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async clearDefaultBilling(userId: string): Promise<void> {
    await prisma.address.updateMany({
      where: { userId, isDefaultBilling: true },
      data: { isDefaultBilling: false },
    });
  }

  async clearDefaultShipping(userId: string): Promise<void> {
    await prisma.address.updateMany({
      where: { userId, isDefaultShipping: true },
      data: { isDefaultShipping: false },
    });
  }

  async create(userId: string, data: Prisma.AddressCreateWithoutUserInput): Promise<Address> {
    if (data.isDefaultBilling) {
      await this.clearDefaultBilling(userId);
    }
    if (data.isDefaultShipping) {
      await this.clearDefaultShipping(userId);
    }

    return prisma.address.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: string, userId: string, data: Prisma.AddressUpdateInput): Promise<Address> {
    if (data.isDefaultBilling) {
      await this.clearDefaultBilling(userId);
    }
    if (data.isDefaultShipping) {
      await this.clearDefaultShipping(userId);
    }

    return prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Address> {
    return prisma.address.delete({
      where: { id, userId },
    });
  }
}

export const addressRepository = new AddressRepository();
