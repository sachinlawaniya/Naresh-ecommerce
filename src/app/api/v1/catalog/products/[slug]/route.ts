import { NextRequest } from "next/server";
import { catalogService } from "@/modules/catalog/services/catalog.service";
import { successResponse, errorResponse } from "@/core/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await catalogService.getProductBySlug(slug);

    return successResponse(product);
  } catch (error) {
    return errorResponse(error);
  }
}
