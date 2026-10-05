import { prisma } from "@/lib/prisma";
import { Category, Prisma } from "@prisma/client";

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  listAll(): Promise<(Category & { children: Category[] })[]>;
  create(data: Prisma.CategoryCreateInput): Promise<Category>;
  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
  delete(id: string): Promise<Category>;
}

const FALLBACK_CATEGORIES = [
  {
    id: "cat-men",
    name: "Men's Clothing",
    slug: "men",
    description: "Premium shirts, jackets, tees and streetwear for men",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-women",
    name: "Women's Clothing",
    slug: "women",
    description: "Outerwear, jackets, tops, and knitwear for women",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-jewellery",
    name: "Jewellery & Accessories",
    slug: "jewellery",
    description: "Gold, silver, diamond rings, bracelets, and luxury pieces",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-electronics",
    name: "Electronics & Gadgets",
    slug: "electronics",
    description: "Gaming monitors, portable SSDs, and tech accessories",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "280 GSM Heavyweight Oversized & Graphic Tees",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-lowers",
    name: "Lowers & Sweatpants",
    slug: "lowers",
    description: "Everyday Relaxed Lowers & Heavyweight French Terry Joggers",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-trousers",
    name: "Trousers",
    slug: "trousers",
    description: "Modern Pleated Trousers & Stretch Chinos",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
  {
    id: "cat-pants",
    name: "Pants & Cargos",
    slug: "pants",
    description: "6-Pocket Tactical Cargos & Relaxed Carpenter Pants",
    imageUrl: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
  },
];

export class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    try {
      const cat = await prisma.category.findUnique({
        where: { id },
        include: { children: true },
      });
      if (cat) return cat;
    } catch (e) {
      // Fallback
    }
    return FALLBACK_CATEGORIES.find((c) => c.id === id) || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const cat = await prisma.category.findUnique({
        where: { slug },
        include: { children: true },
      });
      if (cat) return cat;
    } catch (e) {
      // Fallback
    }
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) || null;
  }

  async listAll(): Promise<(Category & { children: Category[] })[]> {
    try {
      const cats = await prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
      if (cats.length > 0) return cats;
    } catch (e) {
      // Fallback
    }

    return FALLBACK_CATEGORIES as (Category & { children: Category[] })[];
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryRepository = new CategoryRepository();
