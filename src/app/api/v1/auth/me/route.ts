import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authService } from "@/modules/auth/services/auth.service";
import { successResponse, errorResponse } from "@/core/response";
import { UnauthorizedError } from "@/core/errors";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser) {
      throw new UnauthorizedError("Active session not found");
    }

    const profile = await authService.getProfileByAuthId(authUser.id);

    return successResponse({
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      avatarUrl: profile.avatarUrl,
      role: profile.role,
      isActive: profile.isActive,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
