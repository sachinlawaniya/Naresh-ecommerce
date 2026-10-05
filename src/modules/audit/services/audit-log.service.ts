import { prisma } from "@/lib/prisma";

export class AuditLogService {
  async listLogs(params: {
    page: number;
    limit: number;
    action?: string;
    entityType?: string;
  }) {
    const { page, limit, action, entityType } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(action ? { action } : {}),
      ...(entityType ? { entityType } : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}

export const auditLogService = new AuditLogService();
