import { prisma } from "@/lib/prisma";

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export const FAKESTORE_PRODUCTS: FakeStoreProduct[] = [
  // --- MEN'S CLOTHING ---
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: "Mens Casual Slim Fit",
    price: 15.99,
    description:
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    rating: { rate: 2.1, count: 430 },
  },

  // --- WOMEN'S CLOTHING ---
  {
    id: 15,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    price: 56.99,
    description:
      "Note:The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    rating: { rate: 2.6, count: 235 },
  },
  {
    id: 16,
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description:
      "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    rating: { rate: 2.9, count: 340 },
  },
  {
    id: 17,
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description:
      "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=800&q=80",
    rating: { rate: 3.8, count: 679 },
  },
  {
    id: 18,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description:
      "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    rating: { rate: 4.7, count: 130 },
  },
  {
    id: 19,
    title: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description:
      "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    rating: { rate: 4.5, count: 146 },
  },
  {
    id: 20,
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description:
      "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print, V-Neck, Fashion Tees, The fabric is soft and has some stretch.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    rating: { rate: 3.6, count: 145 },
  },

  // --- JEWELLERY ---
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1611591475825-96be0f0970a8?w=800&q=80",
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: "Solid Gold Petite Micropave",
    price: 168,
    description:
      "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed.",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 7,
    title: "White Gold Plated Princess Diamond Ring",
    price: 9.99,
    description:
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    rating: { rate: 3, count: 400 },
  },
  {
    id: 8,
    title: "Pierced Owl Rose Gold Plated Stainless Steel Double Flared Tunnel",
    price: 10.99,
    description:
      "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel. Comfortable and elegant for daily wear.",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    rating: { rate: 1.9, count: 100 },
  },

  // --- ELECTRONICS & ACCESSORIES ---
  {
    id: 9,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    description:
      "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 10,
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 109,
    description:
      "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications).",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80",
    rating: { rate: 2.9, count: 470 },
  },
  {
    id: 11,
    title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost",
    price: 109,
    description:
      "3D NAND flash are applied to deliver high transfer speeds. Remarkable transfer speeds that enable faster bootup and improved overall system performance.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    rating: { rate: 4.8, count: 319 },
  },
  {
    id: 12,
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    price: 114,
    description:
      "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    rating: { rate: 4.8, count: 400 },
  },
  {
    id: 13,
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    price: 599,
    description:
      "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    rating: { rate: 2.9, count: 250 },
  },
  {
    id: 14,
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor – Super Ultrawide Screen QLED",
    price: 999.99,
    description:
      "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80",
    rating: { rate: 2.2, count: 140 },
  },
];

export class FakeStoreSeederService {
  /**
   * Transforms and seeds FakeStoreAPI data into the LUXE database with proper Prisma models, variants, images, and inventory.
   */
  async seedFakeStoreCatalog() {
    // 1. Ensure Default Fulfillment Warehouse
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
      where: { slug: "luxe" },
      update: {},
      create: {
        name: "LUXE Official",
        slug: "luxe",
      },
    });

    // 3. Category Mapping
    const categoryMapping: Record<string, { name: string; slug: string; gstRate: number; hsnCode: string }> = {
      "men's clothing": {
        name: "Men's Clothing",
        slug: "men",
        gstRate: 5.0,
        hsnCode: "61091000",
      },
      "women's clothing": {
        name: "Women's Clothing",
        slug: "women",
        gstRate: 5.0,
        hsnCode: "62044200",
      },
      jewelery: {
        name: "Jewellery & Accessories",
        slug: "jewellery",
        gstRate: 3.0,
        hsnCode: "71131900",
      },
      electronics: {
        name: "Lifestyle & Electronics",
        slug: "electronics",
        gstRate: 18.0,
        hsnCode: "84717020",
      },
    };

    let seededCount = 0;
    let totalVariantsCreated = 0;

    for (const item of FAKESTORE_PRODUCTS) {
      const catConfig = categoryMapping[item.category] || {
        name: "General",
        slug: "general",
        gstRate: 12.0,
        hsnCode: "62034200",
      };

      // Upsert Category
      const category = await prisma.category.upsert({
        where: { slug: catConfig.slug },
        update: {},
        create: {
          name: catConfig.name,
          slug: catConfig.slug,
          description: `Curated ${catConfig.name} on LUXE`,
        },
      });

      // Calculate realistic INR pricing (approx USD * 80 rounded nicely to 99)
      const baseInrPrice = Math.max(799, Math.round((item.price * 80) / 100) * 100 - 1);
      const saleInrPrice = Math.round(baseInrPrice * 0.8 / 100) * 100 - 1;

      const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 80);

      const existingProduct = await prisma.product.findUnique({
        where: { slug },
      });

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: {
            title: item.title,
            slug,
            description: item.description,
            categoryId: category.id,
            brandId: brand.id,
            hsnCode: catConfig.hsnCode,
            gstRate: catConfig.gstRate,
            isPublished: true,
            isFeatured: (item.rating?.rate || 0) >= 3.5,
          },
        });

        // Determine Variants: Clothing gets sizes & colors, Electronics/Jewellery get standard/color options
        const isClothing = item.category.includes("clothing");
        const sizes = isClothing ? ["S", "M", "L", "XL"] : ["Standard"];
        const colors = isClothing
          ? [
              { name: "Pitch Black", hex: "#121212" },
              { name: "Classic Heather", hex: "#6b7280" },
            ]
          : [{ name: "Original Edition", hex: "#121212" }];

        for (const color of colors) {
          for (const size of sizes) {
            const prefix = item.title
              .split(" ")
              .filter(Boolean)
              .map((w) => w[0])
              .join("")
              .substring(0, 3)
              .toUpperCase();
            const colorCode = color.name.substring(0, 3).toUpperCase();
            const sku = `FS-${item.id}-${colorCode}-${size}`;

            await prisma.productVariant.create({
              data: {
                productId: product.id,
                sku,
                colorName: color.name,
                colorHex: color.hex,
                size,
                basePrice: baseInrPrice,
                salePrice: saleInrPrice,
                weightGrams: isClothing ? 280 : 500,
                images: {
                  create: [
                    {
                      url: item.image,
                      sortOrder: 0,
                    },
                  ],
                },
                inventoryItems: {
                  create: {
                    warehouseId: warehouse.id,
                    quantityOnHand: 50,
                    quantityReserved: 0,
                    lowStockAlert: 5,
                  },
                },
              },
            });
            totalVariantsCreated++;
          }
        }
        seededCount++;
      }
    }

    return {
      success: true,
      seededCount,
      totalVariantsCreated,
      totalCatalogSize: FAKESTORE_PRODUCTS.length,
    };
  }
}

export const fakeStoreSeederService = new FakeStoreSeederService();
