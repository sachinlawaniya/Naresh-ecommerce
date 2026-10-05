import { NextRequest } from "next/server";
import { RegisterDtoSchema } from "@/modules/auth/dtos/auth.dto";
import { authService } from "@/modules/auth/services/auth.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = RegisterDtoSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Input validation failed", formattedErrors);
    }

    const user = await authService.registerCustomer(result.data);

    return successResponse(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
      undefined,
      201
    );
  } catch (error) {
    return errorResponse(error);
  }
}
