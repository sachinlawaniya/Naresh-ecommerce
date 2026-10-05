import { supabaseAdmin } from "@/lib/supabase/admin";
import { userRepository, IUserRepository } from "../repositories/user.repository";
import { RegisterDto, UpdateProfileDto, UpdateRoleDto } from "../dtos/auth.dto";
import { ConflictError, NotFoundError, UnauthorizedError, AppError } from "@/core/errors";
import { User, RoleType } from "@prisma/client";
import { logAudit } from "@/core/logger";

export class AuthService {
  constructor(private userRepo: IUserRepository = userRepository) {}

  async registerCustomer(dto: RegisterDto): Promise<User> {
    // 1. Check if user already exists in PostgreSQL
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError("An account with this email already exists");
    }

    if (dto.phone) {
      const existingPhone = await this.userRepo.findByPhone(dto.phone);
      if (existingPhone) {
        throw new ConflictError("An account with this phone number already exists");
      }
    }

    // 2. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true, // Auto-confirm or can be configured via email link
      user_metadata: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    if (authError || !authData.user) {
      throw new AppError(authError?.message || "Failed to create authentication credentials", 400);
    }

    try {
      // 3. Create domain User record in PostgreSQL
      const newUser = await this.userRepo.create({
        authId: authData.user.id,
        email: dto.email,
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: RoleType.CUSTOMER,
      });

      logAudit("USER_REGISTERED", { userId: newUser.id, email: newUser.email });
      return newUser;
    } catch (dbError) {
      // Rollback Supabase user if PostgreSQL insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw dbError;
    }
  }

  async getProfileByAuthId(authId: string): Promise<User> {
    const user = await this.userRepo.findByAuthId(authId);
    if (!user) {
      throw new NotFoundError("User profile does not exist");
    }
    if (!user.isActive) {
      throw new UnauthorizedError("Your account has been deactivated. Please contact support.");
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updated = await this.userRepo.update(userId, dto);
    logAudit("PROFILE_UPDATED", { userId });
    return updated;
  }

  async updateUserRole(targetUserId: string, dto: UpdateRoleDto, operatorUserId: string): Promise<User> {
    const user = await this.userRepo.findById(targetUserId);
    if (!user) {
      throw new NotFoundError("Target user not found");
    }

    const updated = await this.userRepo.updateRole(targetUserId, dto.role);
    logAudit("ROLE_CHANGED", {
      operatorUserId,
      targetUserId,
      oldRole: user.role,
      newRole: dto.role,
    });
    return updated;
  }

  async listUsers(params: {
    page: number;
    limit: number;
    role?: RoleType;
    search?: string;
  }) {
    return this.userRepo.listUsers(params);
  }
}

export const authService = new AuthService();
