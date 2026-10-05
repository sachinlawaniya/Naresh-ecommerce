import { prisma } from "@/lib/prisma";
import { Coupon, Prisma } from "@prisma/client";

export interface ICouponRepository {
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  listAll(): Promise<Coupon[]>;
  create(data: Prisma.CouponCreateInput): Promise<Coupon>;
  incrementUsage(id: string): Promise<Coupon>;
  delete(id: string): Promise<Coupon>;
}

export class CouponRepository implements ICouponRepository {
  async findById(id: string): Promise<Coupon | null> {
    return prisma.coupon.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async listAll(): Promise<Coupon[]> {
    return prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.CouponCreateInput): Promise<Coupon> {
    return prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }

  async incrementUsage(id: string): Promise<Coupon> {
    return prisma.coupon.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }

  async delete(id: string): Promise<Coupon> {
    return prisma.coupon.delete({
      where: { id },
    });
  }
}

export const couponRepository = new CouponRepository();
