import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";

export interface SeedApparelItem {
  title: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  hsnCode: string;
  gstRate: number;
  basePrice: number;
  salePrice?: number;
  colors: Array<{
    name: string;
    hex: string;
    images: string[];
  }>;
  sizes: string[];
}

export class ApparelSeederService {
  /**
   * High-resolution curated apparel data across T-Shirts, Lowers, Trousers, and Cargo Pants.
   */
  private getCuratedApparelCatalog(): SeedApparelItem[] {
    return [
      // 1. T-SHIRTS
      {
        title: "Heavyweight 280 GSM Oversized Boxy Tee",
        categorySlug: "t-shirts",
        categoryName: "T-Shirts",
        description:
          "Architectural relaxed silhouette cut from 280 GSM 100% Super Combed Bio-Washed French Terry cotton. Designed with a thick 1.25-inch Lycra ribbed crewneck collar that never sags.",
        hsnCode: "61091000",
        gstRate: 5.0,
        basePrice: 1299,
        salePrice: 999,
        colors: [
          {
            name: "Obsidian Black",
            hex: "#111827",
            images: [
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85",
              "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85",
            ],
          },
          {
            name: "Chalk Off-White",
            hex: "#f3f4f6",
            images: [
              "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85",
            ],
          },
          {
            name: "Sage Olive Green",
            hex: "#4b5563",
            images: [
              "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85",
            ],
          },
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        title: "Artisan Mineral Acid-Wash Street Tee",
        categorySlug: "t-shirts",
        categoryName: "T-Shirts",
        description:
          "Hand-dyed mineral acid wash offering unique vintage fading. Cut in a drop-shoulder drape with blind stitch finishes at cuffs and hem.",
        hsnCode: "61091000",
        gstRate: 5.0,
        basePrice: 1499,
        salePrice: 1199,
        colors: [
          {
            name: "Charcoal Acid Wash",
            hex: "#374151",
            images: [
              "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85",
            ],
          },
          {
            name: "Washed Sand",
            hex: "#d1d5db",
            images: [
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85",
            ],
          },
        ],
        sizes: ["S", "M", "L", "XL"],
      },

      // 2. LOWERS & SWEATPANTS
      {
        title: "French Terry Heavyweight Relaxed Lower",
        categorySlug: "lowers",
        categoryName: "Lowers & Sweatpants",
        description:
          "Crafted from 380 GSM ultra-soft brushed French Terry. Features an elasticized drawstring waistband, deep concealed zippered pockets, and structured ankle cuffs.",
        hsnCode: "62034200",
        gstRate: 12.0,
        basePrice: 1999,
        salePrice: 1599,
        colors: [
          {
            name: "Jet Black",
            hex: "#000000",
            images: [
              "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=85",
              "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=1000&q=85",
            ],
          },
          {
            name: "Heather Grey",
            hex: "#9ca3af",
            images: [
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85",
            ],
          },
          {
            name: "Forest Pine",
            hex: "#064e3b",
            images: [
              "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=85",
            ],
          },
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        title: "Tapered Streetwear Jogger Lower",
        categorySlug: "lowers",
        categoryName: "Lowers & Sweatpants",
        description:
          "Slim-tapered athletic jogger with 4-way stretch loopback cotton. Ergonomic knee dart construction for full range of movement.",
        hsnCode: "62034200",
        gstRate: 12.0,
        basePrice: 1799,
        salePrice: 1399,
        colors: [
          {
            name: "Navy Blue",
            hex: "#1e3a8a",
            images: [
              "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=1000&q=85",
            ],
          },
          {
            name: "Olive Drab",
            hex: "#3f6212",
            images: [
              "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=85",
            ],
          },
        ],
        sizes: ["S", "M", "L", "XL"],
      },

      // 3. TROUSERS
      {
        title: "Pleated Wide-Leg Tailored Trouser",
        categorySlug: "trousers",
        categoryName: "Trousers",
        description:
          "Modern relaxed tailoring crafted from high-drape poly-viscose twill with double front pleats. Designed to pool elegantly over sneakers or loafers.",
        hsnCode: "62034200",
        gstRate: 12.0,
        basePrice: 2499,
        salePrice: 1999,
        colors: [
          {
            name: "Charcoal Grey",
            hex: "#1f2937",
            images: [
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=85",
              "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&q=85",
            ],
          },
          {
            name: "Warm Mocha Tan",
            hex: "#78350f",
            images: [
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=85",
            ],
          },
          {
            name: "Classic Beige",
            hex: "#d4b996",
            images: [
              "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&q=85",
            ],
          },
        ],
        sizes: ["30", "32", "34", "36", "38"],
      },
      {
        title: "Smart Stretch Tailored Chino Trouser",
        categorySlug: "trousers",
        categoryName: "Trousers",
        description:
          "Refined cotton satin weave with 3% elastane for daily comfort. Features reinforced belt loops, clean welt rear pockets, and wrinkle-resistant finish.",
        hsnCode: "62034200",
        gstRate: 12.0,
        basePrice: 2199,
        salePrice: 1799,
        colors: [
          {
            name: "Midnight Black",
            hex: "#0f172a",
            images: [
              "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&q=85",
            ],
          },
          {
            name: "Khaki Sand",
            hex: "#ca8a04",
            images: [
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=85",
            ],
          },
        ],
        sizes: ["30", "32", "34", "36"],
      },

      // 4. PANTS & CARGOS
      {
        title: "6-Pocket Heavy Duty Tactical Cargo Pant",
        categorySlug: "pants",
        categoryName: "Pants & Cargos",
        description:
          "Heavyweight ripstop cotton fabric engineered for durability. Features bellows cargo pockets with hidden snap closures, reinforced seat, and adjustable ankle toggles.",
        hsnCode: "62034200",
        gstRate: 12.0,
        basePrice: 2799,
        salePrice: 2299,
        colors: [
          {
            name: "Military Olive",
            hex: "#365314",
            images: [
              "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=85",
              "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&q=85",
            ],
          },
          {
            name: "Stealth Black",
            hex: "#09090b",
            images: [
              "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=85",
            ],
          },
          {
            name: "Desert Sand",
            hex: "#a16207",
            images: [
              "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&q=85",
            ],
          },
        ],
        sizes: ["30", "32", "34", "36", "38"],
      },
      {
        title: "Relaxed Carpenter Denim Pant",
        categorySlug: "pants",
        categoryName: "Pants & Cargos",
        description:
          "13.5 oz raw indigo and washed denim with authentic carpenter utility loop and tool pockets. Triple-stitched seams with heavy-duty brass zipper fly.",
        hsnCode: "62034200",
        gstRate: 12.0,
        basePrice: 2999,
        salePrice: 2499,
        colors: [
          {
            name: "Vintage Stone Washed Blue",
            hex: "#2563eb",
            images: [
              "https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&q=85",
            ],
          },
          {
            name: "Raw Indigo Black",
            hex: "#172554",
            images: [
              "https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&q=85",
            ],
          },
        ],
        sizes: ["30", "32", "34", "36"],
      },
    ];
  }

  /**
   * Seeds/Populates the database with real multi-variant SKUs for Lower, T-Shirt, Trouser, and Cargo Pant.
   */
  async seedApparelCatalog() {
    // 1. Ensure Default Warehouse
    const warehouse = await prisma.warehouse.upsert({
      where: { code: "WH-BLR-01" },
      update: {},
      create: {
        name: "Bangalore Central Fulfillment Hub",
        code: "WH-BLR-01",
        addressState: "Karnataka",
        city: "Bengaluru",
        postalCode: "560001",
        isActive: true,
      },
    });

    // 2. Ensure Brand
    const brand = await prisma.brand.upsert({
      where: { slug: "luxe-vogue" },
      update: {},
      create: {
        name: "Luxe Vogue Studio",
        slug: "luxe-vogue",
      },
    });

    // 3. Ensure Collections
    const [oversizedColl, summerColl, pantsColl] = await Promise.all([
      prisma.collection.upsert({
        where: { slug: "oversized-tees" },
        update: {},
        create: {
          name: "Oversized Essentials",
          slug: "oversized-tees",
          description: "280 GSM Boxy French Terry Drops",
          isActive: true,
        },
      }),
      prisma.collection.upsert({
        where: { slug: "summer-drop" },
        update: {},
        create: {
          name: "Summer '26 Drop",
          slug: "summer-drop",
          description: "Lightweight Trousers, Cargo Pants, and Everyday Lowers",
          isActive: true,
        },
      }),
      prisma.collection.upsert({
        where: { slug: "bottomwear-collection" },
        update: {},
        create: {
          name: "Bottomwear & Pants",
          slug: "bottomwear-collection",
          description: "Tailored Trousers, Lowers and Tactical Cargo Pants",
          isActive: true,
        },
      }),
    ]);

    const catalog = this.getCuratedApparelCatalog();
    const createdProducts = [];
    let totalSkusGenerated = 0;

    for (const item of catalog) {
      // Upsert Category
      const category = await prisma.category.upsert({
        where: { slug: item.categorySlug },
        update: {},
        create: {
          name: item.categoryName,
          slug: item.categorySlug,
          description: `Premium ${item.categoryName} by Luxe Vogue Studio`,
        },
      });

      const existingProduct = await prisma.product.findUnique({
        where: { slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      });

      const productSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: {
            title: item.title,
            slug: productSlug,
            description: item.description,
            categoryId: category.id,
            brandId: brand.id,
            hsnCode: item.hsnCode,
            gstRate: item.gstRate,
            isPublished: true,
            isFeatured: true,
            collections: {
              create: [
                { collectionId: oversizedColl.id },
                { collectionId: summerColl.id },
                { collectionId: pantsColl.id },
              ],
            },
          },
        });

        // Generate SKU Matrix
        for (const color of item.colors) {
          for (const size of item.sizes) {
            const prefix = item.title
              .split(" ")
              .filter(Boolean)
              .map((w) => w[0])
              .join("")
              .substring(0, 3)
              .toUpperCase();
            const colorCode = color.name.substring(0, 3).toUpperCase();
            const sku = `${prefix}-${colorCode}-${size}`;

            await prisma.productVariant.create({
              data: {
                productId: product.id,
                sku,
                colorName: color.name,
                colorHex: color.hex,
                size,
                basePrice: item.basePrice,
                salePrice: item.salePrice || null,
                weightGrams: item.categorySlug === "t-shirts" ? 280 : 450,
                images: {
                  create: color.images.map((url, idx) => ({
                    url,
                    sortOrder: idx,
                  })),
                },
                inventoryItems: {
                  create: {
                    warehouseId: warehouse.id,
                    quantityOnHand: 40,
                    quantityReserved: 0,
                    lowStockAlert: 5,
                  },
                },
              },
            });
            totalSkusGenerated++;
          }
        }
        createdProducts.push(product);
      }
    }

    return {
      success: true,
      seededCategories: ["T-Shirts", "Lowers & Sweatpants", "Trousers", "Pants & Cargos"],
      productsCount: createdProducts.length,
      totalSkusGenerated,
    };
  }
}

export const apparelSeederService = new ApparelSeederService();
