import { PrismaClient, DiscountType } from "@prisma/client";
import { apparelSeederService } from "../src/modules/catalog/services/apparel-seeder.service";
import { fakeStoreSeederService } from "../src/modules/catalog/services/fakestore-seeder.service";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Master Database Seeding for Apparel & FakeStoreAPI Categories...");

  // 1. Seed complete apparel catalog
  const apparelResult = await apparelSeederService.seedApparelCatalog();
  console.log("✅ Apparel Catalog Seed Result:", apparelResult);

  // 2. Seed FakeStoreAPI catalog (Men's, Women's, Jewellery, Electronics)
  const fakeStoreResult = await fakeStoreSeederService.seedFakeStoreCatalog();
  console.log("✅ FakeStoreAPI Catalog Seed Result:", fakeStoreResult);

  // 2. Seed Promo Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 300,
      usageLimit: 5000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "LUXE500" },
    update: {},
    create: {
      code: "LUXE500",
      discountType: DiscountType.FLAT_AMOUNT,
      discountValue: 500,
      minOrderValue: 2499,
      usageLimit: 1000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      isActive: true,
    },
  });
  console.log("✅ Seeded Coupons: WELCOME10, LUXE500");

  console.log("🚀 Complete Apparel Seeding Finished Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
