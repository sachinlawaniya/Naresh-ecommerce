import { NextResponse } from "next/server";
import { AppError } from "../errors";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

export function successResponse<T>(data: T, meta?: ApiResponse<T>["meta"], status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      meta: {
        ...meta,
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        meta: { timestamp },
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : "An unexpected internal error occurred";
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
      },
      meta: { timestamp },
    },
    { status: 500 }
  );
}
