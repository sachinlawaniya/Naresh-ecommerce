import { productRepository, IProductRepository, ProductWithDetails } from "../repositories/product.repository";
import { categoryRepository, ICategoryRepository } from "../repositories/category.repository";
import { skuGeneratorService } from "./sku-generator.service";
import { ProductCreateDto, ProductQueryDto, CategoryCreateDto } from "../dtos/catalog.dto";
import { ConflictError, NotFoundError } from "@/core/errors";
import { logAudit } from "@/core/logger";
import { serializePlain } from "@/lib/serialize";

export class CatalogService {
  constructor(
    private productRepo: IProductRepository = productRepository,
    private categoryRepo: ICategoryRepository = categoryRepository
  ) {}

  async getProducts(query: ProductQueryDto) {
    const res = await this.productRepo.list(query);
    return serializePlain(res);
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails> {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new NotFoundError(`Product with slug '${slug}' not found`);
    }
    return serializePlain(product);
  }

  async getCategories() {
    const categories = await this.categoryRepo.listAll();
    return serializePlain(categories);
  }

  async createCategory(dto: CategoryCreateDto) {
    const existing = await this.categoryRepo.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictError(`Category with slug '${dto.slug}' already exists`);
    }

    return this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      imageUrl: dto.imageUrl,
      ...(dto.parentId ? { parent: { connect: { id: dto.parentId } } } : {}),
    });
  }

  async createProductWithMatrix(dto: ProductCreateDto, operatorId?: string): Promise<ProductWithDetails> {
    // 1. Verify slug uniqueness
    const existing = await this.productRepo.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictError(`Product with slug '${dto.slug}' already exists`);
    }

    // 2. Ensure each variant has a unique SKU, generating standard ones if omitted
    const processedVariants = dto.variants.map((v) => ({
      ...v,
      sku: v.sku || skuGeneratorService.generateSku(dto.title, v.colorName, v.size),
    }));

    // Verify all generated SKUs in this payload are distinct
    const skuSet = new Set<string>();
    for (const v of processedVariants) {
      if (skuSet.has(v.sku)) {
        throw new ConflictError(`Duplicate SKU detected in variant payload: '${v.sku}'`);
      }
      skuSet.add(v.sku);
    }

    // 3. Save Product and Variants atomically
    const product = await this.productRepo.createWithVariants({
      ...dto,
      variants: processedVariants,
    });

    logAudit("PRODUCT_CREATED", {
      productId: product.id,
      title: product.title,
      totalVariants: product.variants.length,
      operatorId,
    });

    return product;
  }
}

export const catalogService = new CatalogService();
