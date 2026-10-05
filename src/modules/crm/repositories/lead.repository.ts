import { prisma } from "@/lib/prisma";
import { Lead, LeadActivity, LeadStatus, LeadSource, Prisma } from "@prisma/client";

export interface ILeadRepository {
  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<Lead | null>;
  listLeads(params: {
    page: number;
    limit: number;
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
  }): Promise<{ leads: any[]; total: number }>;
  create(data: Prisma.LeadCreateInput): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus, assignedTo?: string): Promise<Lead>;
  addActivity(leadId: string, data: { note: string; activityType: string }): Promise<LeadActivity>;
}

export class LeadRepository implements ILeadRepository {
  async findById(id: string): Promise<any | null> {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        agent: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  async findByEmail(email: string): Promise<Lead | null> {
    return prisma.lead.findFirst({
      where: { email: email.toLowerCase() },
    });
  }

  async listLeads(params: {
    page: number;
    limit: number;
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
  }): Promise<{ leads: any[]; total: number }> {
    const { page, limit, status, source, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          agent: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          activities: {
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
  }

  async create(data: Prisma.LeadCreateInput): Promise<Lead> {
    return prisma.lead.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  }

  async updateStatus(id: string, status: LeadStatus, assignedTo?: string): Promise<Lead> {
    return prisma.lead.update({
      where: { id },
      data: {
        status,
        ...(assignedTo ? { assignedTo } : {}),
      },
    });
  }

  async addActivity(leadId: string, data: { note: string; activityType: string }): Promise<LeadActivity> {
    return prisma.leadActivity.create({
      data: {
        leadId,
        note: data.note,
        activityType: data.activityType,
      },
    });
  }
}

export const leadRepository = new LeadRepository();
