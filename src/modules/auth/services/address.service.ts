import { addressRepository, IAddressRepository } from "../repositories/address.repository";
import { AddressDto } from "../dtos/auth.dto";
import { NotFoundError } from "@/core/errors";
import { Address } from "@prisma/client";

export class AddressService {
  constructor(private addressRepo: IAddressRepository = addressRepository) {}

  async getUserAddresses(userId: string): Promise<Address[]> {
    return this.addressRepo.findByUserId(userId);
  }

  async createAddress(userId: string, dto: AddressDto): Promise<Address> {
    return this.addressRepo.create(userId, {
      recipientName: dto.recipientName,
      phone: dto.phone,
      streetLine1: dto.streetLine1,
      streetLine2: dto.streetLine2,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country || "India",
      isDefaultBilling: dto.isDefaultBilling,
      isDefaultShipping: dto.isDefaultShipping,
    });
  }

  async updateAddress(addressId: string, userId: string, dto: Partial<AddressDto>): Promise<Address> {
    const existing = await this.addressRepo.findById(addressId);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError("Address not found or unauthorized");
    }

    return this.addressRepo.update(addressId, userId, dto);
  }

  async deleteAddress(addressId: string, userId: string): Promise<Address> {
    const existing = await this.addressRepo.findById(addressId);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError("Address not found or unauthorized");
    }

    return this.addressRepo.delete(addressId, userId);
  }
}

export const addressService = new AddressService();
