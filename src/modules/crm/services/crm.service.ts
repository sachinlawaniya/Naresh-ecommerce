import { leadRepository, ILeadRepository } from "../repositories/lead.repository";
import { LeadCreateDto, LeadActivityCreateDto, LeadUpdateStatusDto } from "../dtos/crm.dto";
import { NotFoundError } from "@/core/errors";
import { LeadStatus, LeadSource } from "@prisma/client";
import { logAudit } from "@/core/logger";

export class CRMService {
  constructor(private leadRepo: ILeadRepository = leadRepository) {}

  async listLeads(params: {
    page: number;
    limit: number;
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
  }) {
    return this.leadRepo.listLeads(params);
  }

  async getLeadDetails(id: string) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundError("Lead not found");
    }
    return lead;
  }

  async captureLead(dto: LeadCreateDto) {
    const existing = await this.leadRepo.findByEmail(dto.email);

    if (existing) {
      // Update existing lead cart data if abandoned
      if (dto.source === LeadSource.ABANDONED_CART && dto.cartData) {
        return this.leadRepo.addActivity(existing.id, {
          activityType: "NOTE",
          note: `Abandoned cart updated with ${Object.keys(dto.cartData).length} items`,
        });
      }
      return existing;
    }

    const lead = await this.leadRepo.create({
      email: dto.email,
      phone: dto.phone,
      name: dto.name,
      source: dto.source,
      status: dto.source === LeadSource.ABANDONED_CART ? LeadStatus.CART_ABANDONED : LeadStatus.NEW,
      cartData: dto.cartData ? JSON.stringify(dto.cartData) : undefined,
    });

    logAudit("CRM_LEAD_CAPTURED", { leadId: lead.id, email: lead.email, source: lead.source });
    return lead;
  }

  async updateLeadStatus(id: string, dto: LeadUpdateStatusDto, operatorId?: string) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    const updated = await this.leadRepo.updateStatus(id, dto.status, dto.assignedTo);
    logAudit("LEAD_STATUS_UPDATED", {
      leadId: id,
      previousStatus: lead.status,
      newStatus: dto.status,
      operatorId,
    });
    return updated;
  }

  async addActivity(leadId: string, dto: LeadActivityCreateDto, operatorId?: string) {
    const lead = await this.leadRepo.findById(leadId);
    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    const activity = await this.leadRepo.addActivity(leadId, dto);
    logAudit("LEAD_ACTIVITY_LOGGED", { leadId, activityType: dto.activityType, operatorId });
    return activity;
  }
}

export const crmService = new CRMService();
