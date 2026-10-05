import { NextRequest } from "next/server";
import { apparelSeederService } from "@/modules/catalog/services/apparel-seeder.service";
import { successResponse, errorResponse } from "@/core/response";

export async function POST() {
  try {
    const result = await apparelSeederService.seedApparelCatalog();
    return successResponse(result, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
