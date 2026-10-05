/**
 * Deeply serializes any data structure into pure plain JavaScript objects,
 * arrays, and primitives. Converts Prisma.Decimal instances into standard numbers
 * and Date instances into ISO strings to safely cross Next.js Server/Client component boundaries.
 */
export function serializePlain<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle BigInt
  if (typeof data === "bigint") {
    return Number(data) as unknown as T;
  }

  // Handle Prisma Decimal / Decimal.js objects
  if (
    typeof data === "object" &&
    data !== null &&
    ("toNumber" in (data as any) ||
      ("d" in (data as any) && "e" in (data as any) && "s" in (data as any)))
  ) {
    const dec = data as any;
    if (typeof dec.toNumber === "function") {
      return dec.toNumber() as unknown as T;
    }
    return Number(dec.toString()) as unknown as T;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializePlain(item)) as unknown as T;
  }

  // Handle Objects
  if (typeof data === "object") {
    const serialized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializePlain(value);
    }
    return serialized as unknown as T;
  }

  return data;
}
