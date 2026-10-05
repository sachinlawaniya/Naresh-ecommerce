import { prisma } from "@/lib/prisma";
import { User, RoleType, Prisma } from "@prisma/client";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByAuthId(authId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  updateRole(id: string, role: RoleType): Promise<User>;
  listUsers(params: {
    page: number;
    limit: number;
    role?: RoleType;
    search?: string;
  }): Promise<{ users: User[]; total: number }>;
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByAuthId(authId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { authId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { phone },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateRole(id: string, role: RoleType): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async listUsers(params: {
    page: number;
    limit: number;
    role?: RoleType;
    search?: string;
  }): Promise<{ users: User[]; total: number }> {
    const { page, limit, role, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }
}

export const userRepository = new UserRepository();
