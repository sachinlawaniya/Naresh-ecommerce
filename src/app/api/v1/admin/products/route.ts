import { NextRequest } from "next/server";
import { ProductCreateDtoSchema } from "@/modules/catalog/dtos/catalog.dto";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import { successResponse, errorResponse } from "@/core/response";
import { ValidationError } from "@/core/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProductCreateDtoSchema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      throw new ValidationError("Invalid product and variant matrix input", formattedErrors);
    }

    const product = await catalogService.createProductWithMatrix(parsed.data);
    return successResponse(product, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
