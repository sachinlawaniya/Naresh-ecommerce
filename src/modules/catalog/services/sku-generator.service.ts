export class SkuGeneratorService {
  /**
   * Generates a standardized, clean SKU string.
   * Example: "Oversized Vintage T-Shirt", "Black", "L" -> "OVT-BLK-L"
   */
  generateSku(productTitle: string, colorName: string, size: string): string {
    // 1. Extract initials/acronym from title (e.g. "Oversized Heavy Tee" -> "OHT")
    const titleInitials = productTitle
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 4)
      .join("");

    const prefix = titleInitials.length >= 2 ? titleInitials : productTitle.substring(0, 3).toUpperCase();

    // 2. Color 3-letter code
    const cleanColor = colorName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 3)
      .toUpperCase();

    // 3. Clean Size code
    const cleanSize = size
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    return `${prefix}-${cleanColor}-${cleanSize}`;
  }

  /**
   * Computes full Cartesian product matrix given lists of colors and sizes.
   */
  generateMatrixCombinations(
    productTitle: string,
    colors: Array<{ name: string; hex: string }>,
    sizes: string[],
    defaultBasePrice: number
  ) {
    const combinations = [];

    for (const color of colors) {
      for (const size of sizes) {
        combinations.push({
          colorName: color.name,
          colorHex: color.hex,
          size: size,
          sku: this.generateSku(productTitle, color.name, size),
          basePrice: defaultBasePrice,
          salePrice: null,
          weightGrams: 250,
          imageUrls: [],
          initialStock: 0,
        });
      }
    }

    return combinations;
  }
}

export const skuGeneratorService = new SkuGeneratorService();
