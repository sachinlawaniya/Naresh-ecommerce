import { NextRequest } from "next/server";
import { fakeStoreSeederService } from "@/modules/catalog/services/fakestore-seeder.service";
import { successResponse, errorResponse } from "@/core/response";

export async function POST(req: NextRequest) {
  try {
    const result = await fakeStoreSeederService.seedFakeStoreCatalog();
    return successResponse(result, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const result = await fakeStoreSeederService.seedFakeStoreCatalog();
    return successResponse(result, undefined, 200);
  } catch (error) {
    return errorResponse(error);
  }
}
