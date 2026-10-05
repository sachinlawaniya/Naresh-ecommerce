import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authService } from "@/modules/auth/services/auth.service";
import { addressService } from "@/modules/auth/services/address.service";
import { AddressDtoSchema } from "@/modules/auth/dtos/auth.dto";
import { successResponse, errorResponse } from "@/core/response";
import { UnauthorizedError, ValidationError } from "@/core/errors";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new UnauthorizedError();
    }

    const profile = await authService.getProfileByAuthId(authUser.id);
    const addresses = await addressService.getUserAddresses(profile.id);

    return successResponse(addresses);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new UnauthorizedError();
    }

    const profile = await authService.getProfileByAuthId(authUser.id);
    const body = await req.json();
    const parsed = AddressDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid address information", formattedErrors);
    }

    const createdAddress = await addressService.createAddress(profile.id, parsed.data);
    return successResponse(createdAddress, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
