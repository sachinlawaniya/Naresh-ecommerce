import { prisma } from "@/lib/prisma";
import { Product, ProductVariant, Prisma } from "@prisma/client";
import { ProductQueryDto, ProductCreateDto } from "../dtos/catalog.dto";
import { serializePlain } from "@/lib/serialize";

export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
    variants: {
      include: {
        images: true;
        inventoryItems: true;
      };
    };
    collections: {
      include: {
        collection: true;
      };
    };
  };
}>;

export interface IProductRepository {
  findById(id: string): Promise<ProductWithDetails | null>;
  findBySlug(slug: string): Promise<ProductWithDetails | null>;
  list(query: ProductQueryDto): Promise<{ products: ProductWithDetails[]; total: number }>;
  createWithVariants(data: ProductCreateDto): Promise<ProductWithDetails>;
  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>;
  delete(id: string): Promise<Product>;
}

// Full resilient catalog combining FakeStoreAPI and Luxe Apparel
const FALLBACK_APPAREL_PRODUCTS: ProductWithDetails[] = [
  // --- FAKESTORE: MEN'S CLOTHING ---
  {
    id: "fs-prod-1",
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    slug: "fjallraven-foldsack-no-1-backpack",
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment.",
    categoryId: "cat-men",
    brandId: "brand-luxe",
    hsnCode: "42021220",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-men",
      name: "Men's Clothing",
      slug: "men",
      description: "Men's apparel and accessories",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-1-std",
        productId: "fs-prod-1",
        sku: "FS-1-BLK-STD",
        barcode: "890123450001",
        colorName: "Nordic Blue / Black",
        colorHex: "#1e3a8a",
        size: "Standard",
        basePrice: new Prisma.Decimal(4999),
        salePrice: new Prisma.Decimal(3999),
        costPrice: new Prisma.Decimal(1800),
        weightGrams: 750,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-1", variantId: "var-fs-1-std", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", altText: "Fjallraven Backpack", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-1", variantId: "var-fs-1-std", warehouseId: "wh-01", quantityOnHand: 45, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "fs-prod-2",
    title: "Mens Casual Premium Slim Fit T-Shirts",
    slug: "mens-casual-premium-slim-fit-t-shirts",
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    categoryId: "cat-men",
    brandId: "brand-luxe",
    hsnCode: "61091000",
    gstRate: new Prisma.Decimal(5.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-men",
      name: "Men's Clothing",
      slug: "men",
      description: "Men's apparel and essentials",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-2-m",
        productId: "fs-prod-2",
        sku: "FS-2-NVY-M",
        barcode: "890123450002",
        colorName: "Navy Henley",
        colorHex: "#1e3a8a",
        size: "M",
        basePrice: new Prisma.Decimal(1499),
        salePrice: new Prisma.Decimal(1099),
        costPrice: new Prisma.Decimal(400),
        weightGrams: 220,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-2", variantId: "var-fs-2-m", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80", altText: "Mens Slim Fit Henley", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-2", variantId: "var-fs-2-m", warehouseId: "wh-01", quantityOnHand: 60, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
      {
        id: "var-fs-2-l",
        productId: "fs-prod-2",
        sku: "FS-2-NVY-L",
        barcode: "890123450003",
        colorName: "Navy Henley",
        colorHex: "#1e3a8a",
        size: "L",
        basePrice: new Prisma.Decimal(1499),
        salePrice: new Prisma.Decimal(1099),
        costPrice: new Prisma.Decimal(400),
        weightGrams: 220,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-2-l", variantId: "var-fs-2-l", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", altText: "Mens Slim Fit Henley", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-2-l", variantId: "var-fs-2-l", warehouseId: "wh-01", quantityOnHand: 50, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "fs-prod-3",
    title: "Mens Cotton Jacket",
    slug: "mens-cotton-jacket",
    description:
      "Great outerwear jacket for Spring, Autumn and Winter. Suitable for casual outings, streetwear, work, and everyday comfort with durable zip closure and utility pockets.",
    categoryId: "cat-men",
    brandId: "brand-luxe",
    hsnCode: "62011200",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-men",
      name: "Men's Clothing",
      slug: "men",
      description: "Men's jackets and outerwear",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-3-l",
        productId: "fs-prod-3",
        sku: "FS-3-BRN-L",
        barcode: "890123450004",
        colorName: "Caramel Brown",
        colorHex: "#92400e",
        size: "L",
        basePrice: new Prisma.Decimal(3499),
        salePrice: new Prisma.Decimal(2799),
        costPrice: new Prisma.Decimal(1200),
        weightGrams: 650,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-3", variantId: "var-fs-3-l", url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", altText: "Mens Cotton Jacket", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-3", variantId: "var-fs-3-l", warehouseId: "wh-01", quantityOnHand: 35, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },

  // --- FAKESTORE: WOMEN'S CLOTHING ---
  {
    id: "fs-prod-15",
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    slug: "biylaclesen-womens-3-in-1-snowboard-jacket",
    description:
      "Multi-layered windproof and waterproof outerwear with warm fleece liner. Designed for extreme comfort, outdoor travels, and winter streetwear.",
    categoryId: "cat-women",
    brandId: "brand-luxe",
    hsnCode: "62021200",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-women",
      name: "Women's Clothing",
      slug: "women",
      description: "Women's jackets, coats, and apparel",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-15-m",
        productId: "fs-prod-15",
        sku: "FS-15-PPL-M",
        barcode: "890123450005",
        colorName: "Deep Violet",
        colorHex: "#581c87",
        size: "M",
        basePrice: new Prisma.Decimal(4299),
        salePrice: new Prisma.Decimal(3499),
        costPrice: new Prisma.Decimal(1500),
        weightGrams: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-15", variantId: "var-fs-15-m", url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80", altText: "Women Snowboard Jacket", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-15", variantId: "var-fs-15-m", warehouseId: "wh-01", quantityOnHand: 25, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "fs-prod-16",
    title: "Lock and Love Women's Removable Hooded Moto Biker Jacket",
    slug: "lock-and-love-womens-moto-biker-jacket",
    description:
      "Faux leather biker style with 2 front pockets and removable knit hood. Sleek tailored silhouette providing the ultimate luxury look.",
    categoryId: "cat-women",
    brandId: "brand-luxe",
    hsnCode: "62021200",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-women",
      name: "Women's Clothing",
      slug: "women",
      description: "Women's jackets and streetwear",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-16-s",
        productId: "fs-prod-16",
        sku: "FS-16-BLK-S",
        barcode: "890123450006",
        colorName: "Pitch Black",
        colorHex: "#121212",
        size: "S",
        basePrice: new Prisma.Decimal(2999),
        salePrice: new Prisma.Decimal(2399),
        costPrice: new Prisma.Decimal(1000),
        weightGrams: 550,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-16", variantId: "var-fs-16-s", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", altText: "Moto Biker Jacket", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-16", variantId: "var-fs-16-s", warehouseId: "wh-01", quantityOnHand: 30, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },

  // --- FAKESTORE: JEWELLERY & ACCESSORIES ---
  {
    id: "fs-prod-5",
    title: "John Hardy Legends Naga Gold & Silver Dragon Bracelet",
    slug: "john-hardy-legends-naga-dragon-bracelet",
    description:
      "Hand-crafted sterling silver and 18K yellow gold dragon station chain bracelet. Inspired by the mythological water dragon of Balinese folklore.",
    categoryId: "cat-jewellery",
    brandId: "brand-luxe",
    hsnCode: "71131900",
    gstRate: new Prisma.Decimal(3.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-jewellery",
      name: "Jewellery & Accessories",
      slug: "jewellery",
      description: "Fine luxury jewellery and precious metal designs",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-5-std",
        productId: "fs-prod-5",
        sku: "FS-5-GLD-STD",
        barcode: "890123450007",
        colorName: "Silver & 18K Gold",
        colorHex: "#e5e7eb",
        size: "Standard",
        basePrice: new Prisma.Decimal(9999),
        salePrice: new Prisma.Decimal(7999),
        costPrice: new Prisma.Decimal(4000),
        weightGrams: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-5", variantId: "var-fs-5-std", url: "https://images.unsplash.com/photo-1611591475825-96be0f0970a8?w=800&q=80", altText: "Dragon Bracelet", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-5", variantId: "var-fs-5-std", warehouseId: "wh-01", quantityOnHand: 20, quantityReserved: 0, lowStockAlert: 3, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "fs-prod-7",
    title: "White Gold Plated Princess Diamond Ring",
    slug: "white-gold-plated-princess-diamond-ring",
    description:
      "Classic solitaire princess diamond engagement ring with rhodium white gold plating. Brilliant sparkle crafted for timeless elegance.",
    categoryId: "cat-jewellery",
    brandId: "brand-luxe",
    hsnCode: "71131900",
    gstRate: new Prisma.Decimal(3.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-jewellery",
      name: "Jewellery & Accessories",
      slug: "jewellery",
      description: "Fine rings and jewellery",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-7-std",
        productId: "fs-prod-7",
        sku: "FS-7-WHT-STD",
        barcode: "890123450008",
        colorName: "White Gold",
        colorHex: "#f8fafc",
        size: "Standard",
        basePrice: new Prisma.Decimal(1999),
        salePrice: new Prisma.Decimal(1499),
        costPrice: new Prisma.Decimal(600),
        weightGrams: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-7", variantId: "var-fs-7-std", url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", altText: "Princess Diamond Ring", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-7", variantId: "var-fs-7-std", warehouseId: "wh-01", quantityOnHand: 40, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },

  // --- FAKESTORE: ELECTRONICS & ACCESSORIES ---
  {
    id: "fs-prod-9",
    title: "WD 2TB Elements Portable External Hard Drive",
    slug: "wd-2tb-elements-portable-external-hard-drive",
    description:
      "Ultra-fast USB 3.0 data transfers, sleek compact design, and massive 2TB high capacity storage for PC and Mac.",
    categoryId: "cat-electronics",
    brandId: "brand-luxe",
    hsnCode: "84717020",
    gstRate: new Prisma.Decimal(18.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-electronics",
      name: "Electronics & Gadgets",
      slug: "electronics",
      description: "Smart storage and lifestyle tech",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-9-std",
        productId: "fs-prod-9",
        sku: "FS-9-BLK-2TB",
        barcode: "890123450009",
        colorName: "Matte Black",
        colorHex: "#121212",
        size: "2TB",
        basePrice: new Prisma.Decimal(5499),
        salePrice: new Prisma.Decimal(4699),
        costPrice: new Prisma.Decimal(2800),
        weightGrams: 230,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-9", variantId: "var-fs-9-std", url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80", altText: "WD 2TB Hard Drive", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-9", variantId: "var-fs-9-std", warehouseId: "wh-01", quantityOnHand: 50, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "fs-prod-14",
    title: "Samsung 49-Inch Curved Gaming QLED Monitor",
    slug: "samsung-49-inch-curved-gaming-qled-monitor",
    description:
      "49-inch Super Ultrawide 32:9 curved gaming monitor with dual 27-inch screen real-estate, Quantum Dot QLED technology, and 144Hz high refresh rate.",
    categoryId: "cat-electronics",
    brandId: "brand-luxe",
    hsnCode: "85285200",
    gstRate: new Prisma.Decimal(18.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-electronics",
      name: "Electronics & Gadgets",
      slug: "electronics",
      description: "Monitors and displays",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-fs-14-std",
        productId: "fs-prod-14",
        sku: "FS-14-BLK-49IN",
        barcode: "890123450010",
        colorName: "Space Black",
        colorHex: "#09090b",
        size: "49 Inch",
        basePrice: new Prisma.Decimal(89999),
        salePrice: new Prisma.Decimal(79999),
        costPrice: new Prisma.Decimal(45000),
        weightGrams: 15000,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-fs-14", variantId: "var-fs-14-std", url: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80", altText: "Samsung Curved Monitor", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-fs-14", variantId: "var-fs-14-std", warehouseId: "wh-01", quantityOnHand: 15, quantityReserved: 0, lowStockAlert: 2, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },

  // --- LUXE STREETWEAR & APPAREL PIECES ---
  {
    id: "prod-tshirt-01",
    title: "Heavyweight 280 GSM Oversized Boxy Tee",
    slug: "oversized-heavyweight-tee",
    description:
      "Architectural relaxed silhouette cut from 280 GSM 100% Super Combed Bio-Washed French Terry cotton. Designed with a thick 1.25-inch Lycra ribbed crewneck collar that never sags.",
    categoryId: "cat-tshirts",
    brandId: "brand-luxe",
    hsnCode: "61091000",
    gstRate: new Prisma.Decimal(5.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-tshirts",
      name: "T-Shirts",
      slug: "t-shirts",
      description: "Heavyweight Tees",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-ts-01",
        productId: "prod-tshirt-01",
        sku: "OHT-BLK-M",
        barcode: "890123456701",
        colorName: "Obsidian Black",
        colorHex: "#111827",
        size: "M",
        basePrice: new Prisma.Decimal(1299),
        salePrice: new Prisma.Decimal(999),
        costPrice: new Prisma.Decimal(450),
        weightGrams: 280,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-ts-01", variantId: "var-ts-01", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85", altText: "Obsidian Black", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-ts-01", variantId: "var-ts-01", warehouseId: "wh-01", quantityOnHand: 40, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
      {
        id: "var-ts-02",
        productId: "prod-tshirt-01",
        sku: "OHT-WHT-L",
        barcode: "890123456702",
        colorName: "Chalk Off-White",
        colorHex: "#f3f4f6",
        size: "L",
        basePrice: new Prisma.Decimal(1299),
        salePrice: new Prisma.Decimal(999),
        costPrice: new Prisma.Decimal(450),
        weightGrams: 280,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-ts-02", variantId: "var-ts-02", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85", altText: "Chalk Off-White", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-ts-02", variantId: "var-ts-02", warehouseId: "wh-01", quantityOnHand: 35, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
      {
        id: "var-ts-03",
        productId: "prod-tshirt-01",
        sku: "OHT-SGE-XL",
        barcode: "890123456703",
        colorName: "Sage Olive Green",
        colorHex: "#4b5563",
        size: "XL",
        basePrice: new Prisma.Decimal(1299),
        salePrice: new Prisma.Decimal(999),
        costPrice: new Prisma.Decimal(450),
        weightGrams: 280,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-ts-03", variantId: "var-ts-03", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85", altText: "Sage Olive", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-ts-03", variantId: "var-ts-03", warehouseId: "wh-01", quantityOnHand: 25, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "prod-lower-01",
    title: "French Terry Heavyweight Relaxed Lower",
    slug: "heavyweight-relaxed-lower",
    description:
      "Crafted from 380 GSM ultra-soft brushed French Terry. Features an elasticized drawstring waistband, deep concealed zippered pockets, and structured ankle cuffs.",
    categoryId: "cat-lowers",
    brandId: "brand-luxe",
    hsnCode: "62034200",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-lowers",
      name: "Lowers & Sweatpants",
      slug: "lowers",
      description: "Everyday Relaxed Lowers",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-lw-01",
        productId: "prod-lower-01",
        sku: "FTH-BLK-M",
        barcode: "890123456704",
        colorName: "Jet Black",
        colorHex: "#000000",
        size: "M",
        basePrice: new Prisma.Decimal(1999),
        salePrice: new Prisma.Decimal(1599),
        costPrice: new Prisma.Decimal(700),
        weightGrams: 420,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-lw-01", variantId: "var-lw-01", url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=85", altText: "Jet Black Lower", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-lw-01", variantId: "var-lw-01", warehouseId: "wh-01", quantityOnHand: 50, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "prod-trouser-01",
    title: "Pleated Wide-Leg Tailored Trouser",
    slug: "pleated-tailored-trouser",
    description:
      "Modern relaxed tailoring crafted from high-drape poly-viscose twill with double front pleats. Designed to pool elegantly over sneakers or loafers.",
    categoryId: "cat-trousers",
    brandId: "brand-luxe",
    hsnCode: "62034200",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-trousers",
      name: "Trousers",
      slug: "trousers",
      description: "Tailored Trousers",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-tr-01",
        productId: "prod-trouser-01",
        sku: "PWT-CHR-32",
        barcode: "890123456706",
        colorName: "Charcoal Grey",
        colorHex: "#1f2937",
        size: "32",
        basePrice: new Prisma.Decimal(2499),
        salePrice: new Prisma.Decimal(1999),
        costPrice: new Prisma.Decimal(900),
        weightGrams: 480,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-tr-01", variantId: "var-tr-01", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=85", altText: "Charcoal Trouser", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-tr-01", variantId: "var-tr-01", warehouseId: "wh-01", quantityOnHand: 30, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
  {
    id: "prod-cargo-01",
    title: "6-Pocket Heavy Duty Tactical Cargo Pant",
    slug: "tactical-cargo-pant",
    description:
      "Heavyweight ripstop cotton fabric engineered for durability. Features bellows cargo pockets with hidden snap closures, reinforced seat, and adjustable ankle toggles.",
    categoryId: "cat-pants",
    brandId: "brand-luxe",
    hsnCode: "62034200",
    gstRate: new Prisma.Decimal(12.0),
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "cat-pants",
      name: "Pants & Cargos",
      slug: "pants",
      description: "Utility Pants & Cargos",
      imageUrl: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    brand: {
      id: "brand-luxe",
      name: "LUXE",
      slug: "luxe",
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    variants: [
      {
        id: "var-cg-01",
        productId: "prod-cargo-01",
        sku: "TCP-OLV-32",
        barcode: "890123456708",
        colorName: "Military Olive",
        colorHex: "#365314",
        size: "32",
        basePrice: new Prisma.Decimal(2799),
        salePrice: new Prisma.Decimal(2299),
        costPrice: new Prisma.Decimal(1050),
        weightGrams: 550,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          { id: "img-cg-01", variantId: "var-cg-01", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=85", altText: "Military Olive Cargo", sortOrder: 0 },
        ],
        inventoryItems: [
          { id: "inv-cg-01", variantId: "var-cg-01", warehouseId: "wh-01", quantityOnHand: 45, quantityReserved: 0, lowStockAlert: 5, updatedAt: new Date() },
        ],
      },
    ],
    collections: [],
  },
];

export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<ProductWithDetails | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          variants: {
            include: {
              images: { orderBy: { sortOrder: "asc" } },
              inventoryItems: true,
            },
          },
          collections: {
            include: {
              collection: true,
            },
          },
        },
      });

      if (product) return serializePlain(product);
    } catch (e) {
      // Fallback
    }

    const fallback =
      FALLBACK_APPAREL_PRODUCTS.find((p) => p.id === id) ||
      FALLBACK_APPAREL_PRODUCTS.find((p) => p.variants.some((v) => v.id === id)) ||
      null;

    return fallback ? serializePlain(fallback) : null;
  }

  async findBySlug(slug: string): Promise<ProductWithDetails | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          brand: true,
          variants: {
            include: {
              images: { orderBy: { sortOrder: "asc" } },
              inventoryItems: true,
            },
          },
          collections: {
            include: {
              collection: true,
            },
          },
        },
      });

      if (product) return serializePlain(product);
    } catch (e) {
      // Fallback
    }

    const fallback = FALLBACK_APPAREL_PRODUCTS.find((p) => p.slug === slug) || FALLBACK_APPAREL_PRODUCTS[0];
    return fallback ? serializePlain(fallback) : null;
  }

  async list(query: ProductQueryDto): Promise<{ products: ProductWithDetails[]; total: number }> {
    const { page, limit, categorySlug, collectionSlug, minPrice, maxPrice, size, color, search, sort } = query;
    const skip = (page - 1) * limit;

    try {
      const where: Prisma.ProductWhereInput = {
        isPublished: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(collectionSlug ? { collections: { some: { collection: { slug: collectionSlug } } } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(minPrice || maxPrice || size || color
          ? {
              variants: {
                some: {
                  ...(minPrice ? { basePrice: { gte: minPrice } } : {}),
                  ...(maxPrice ? { basePrice: { lte: maxPrice } } : {}),
                  ...(size ? { size: { equals: size, mode: "insensitive" } } : {}),
                  ...(color ? { colorName: { equals: color, mode: "insensitive" } } : {}),
                },
              },
            }
          : {}),
      };

      let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
      if (sort === "featured") {
        orderBy = { isFeatured: "desc" };
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            category: true,
            brand: true,
            variants: {
              include: {
                images: { orderBy: { sortOrder: "asc" } },
                inventoryItems: true,
              },
            },
            collections: {
              include: {
                collection: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      if (products.length > 0) {
        return { products: serializePlain(products), total };
      }
    } catch (e) {
      // Database is connecting or offline, fallback smoothly
    }

    // Filter fallback data by category or search
    let filtered = FALLBACK_APPAREL_PRODUCTS;
    if (categorySlug) {
      filtered = filtered.filter((p) => p.category?.slug === categorySlug);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }

    return { products: serializePlain(filtered), total: filtered.length };
  }

  async createWithVariants(dto: ProductCreateDto): Promise<ProductWithDetails> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          categoryId: dto.categoryId,
          brandId: dto.brandId,
          hsnCode: dto.hsnCode,
          gstRate: dto.gstRate,
          isPublished: dto.isPublished,
          isFeatured: dto.isFeatured,
          collections: {
            create: dto.collectionIds.map((cId) => ({
              collectionId: cId,
            })),
          },
        },
      });

      for (const variant of dto.variants) {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: variant.sku!,
            barcode: variant.barcode,
            colorName: variant.colorName,
            colorHex: variant.colorHex,
            size: variant.size,
            basePrice: variant.basePrice,
            salePrice: variant.salePrice,
            costPrice: variant.costPrice,
            weightGrams: variant.weightGrams,
            images: {
              create: variant.imageUrls.map((url, idx) => ({
                url,
                sortOrder: idx,
              })),
            },
          },
        });
      }

      const created = await tx.product.findUniqueOrThrow({
        where: { id: product.id },
        include: {
          category: true,
          brand: true,
          variants: {
            include: {
              images: { orderBy: { sortOrder: "asc" } },
              inventoryItems: true,
            },
          },
          collections: {
            include: {
              collection: true,
            },
          },
        },
      });

      return serializePlain(created);
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
