import { NextRequest } from "next/server";
import { CategoryCreateDtoSchema } from "@/modules/catalog/dtos/catalog.dto";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function GET() {
  try {
    const categories = await catalogService.getCategories();
    return successResponse(categories);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CategoryCreateDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid category input", formattedErrors);
    }

    const created = await catalogService.createCategory(parsed.data);
    return successResponse(created, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
