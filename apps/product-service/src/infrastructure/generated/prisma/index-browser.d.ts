export const __esModule: boolean;
export namespace Prisma {
    namespace TransactionIsolationLevel {
        let ReadUncommitted: string;
        let ReadCommitted: string;
        let RepeatableRead: string;
        let Serializable: string;
    }
    namespace ProductScalarFieldEnum {
        let id: string;
        let productId: string;
        let name: string;
        let description: string;
        let price: string;
        let currency: string;
        let categoryId: string;
        let artisanId: string;
        let status: string;
        let availability: string;
        let craftingTimeHours: string;
        let sustainabilityScore: string;
        let isCustomizable: string;
        let materials: string;
        let dimensions: string;
        let createdAt: string;
        let updatedAt: string;
    }
    namespace ProductVariantScalarFieldEnum {
        let id_1: string;
        export { id_1 as id };
        let productId_1: string;
        export { productId_1 as productId };
        let name_1: string;
        export { name_1 as name };
        let description_1: string;
        export { description_1 as description };
        let price_1: string;
        export { price_1 as price };
        let currency_1: string;
        export { currency_1 as currency };
        export let sku: string;
        export let attributes: string;
        export let isActive: string;
        let createdAt_1: string;
        export { createdAt_1 as createdAt };
        let updatedAt_1: string;
        export { updatedAt_1 as updatedAt };
    }
    namespace ProductImageScalarFieldEnum {
        let id_2: string;
        export { id_2 as id };
        let productId_2: string;
        export { productId_2 as productId };
        export let url: string;
        export let altText: string;
        export let isPrimary: string;
        export let sortOrder: string;
        let createdAt_2: string;
        export { createdAt_2 as createdAt };
        let updatedAt_2: string;
        export { updatedAt_2 as updatedAt };
    }
    namespace ProductTagScalarFieldEnum {
        let id_3: string;
        export { id_3 as id };
        let productId_3: string;
        export { productId_3 as productId };
        let name_2: string;
        export { name_2 as name };
        let createdAt_3: string;
        export { createdAt_3 as createdAt };
        let updatedAt_3: string;
        export { updatedAt_3 as updatedAt };
    }
    namespace CategoryScalarFieldEnum {
        let id_4: string;
        export { id_4 as id };
        let name_3: string;
        export { name_3 as name };
        let description_2: string;
        export { description_2 as description };
        export let parentId: string;
        let createdAt_4: string;
        export { createdAt_4 as createdAt };
        let updatedAt_4: string;
        export { updatedAt_4 as updatedAt };
    }
    namespace ArtisanScalarFieldEnum {
        let id_5: string;
        export { id_5 as id };
        export let businessName: string;
        export let contactName: string;
        export let email: string;
        export let phone: string;
        export let address: string;
        let description_3: string;
        export { description_3 as description };
        export let specialties: string;
        export let isVerified: string;
        export let verificationDate: string;
        let status_1: string;
        export { status_1 as status };
        export let rating: string;
        export let totalProducts: string;
        export let totalSales: string;
        let createdAt_5: string;
        export { createdAt_5 as createdAt };
        let updatedAt_5: string;
        export { updatedAt_5 as updatedAt };
    }
    namespace ProductInventoryScalarFieldEnum {
        let id_6: string;
        export { id_6 as id };
        let productId_4: string;
        export { productId_4 as productId };
        export let quantity: string;
        export let reserved: string;
        export let available: string;
        export let lowStockThreshold: string;
        export let lastRestocked: string;
        export let lastSold: string;
        export let location: string;
        let createdAt_6: string;
        export { createdAt_6 as createdAt };
        let updatedAt_6: string;
        export { updatedAt_6 as updatedAt };
    }
    namespace ProductReviewScalarFieldEnum {
        let id_7: string;
        export { id_7 as id };
        let productId_5: string;
        export { productId_5 as productId };
        let rating_1: string;
        export { rating_1 as rating };
        export let title: string;
        export let comment: string;
        export let userId: string;
        export let userName: string;
        export let userEmail: string;
        let status_2: string;
        export { status_2 as status };
        let isVerified_1: string;
        export { isVerified_1 as isVerified };
        export let moderatedBy: string;
        export let moderatedAt: string;
        let createdAt_7: string;
        export { createdAt_7 as createdAt };
        let updatedAt_7: string;
        export { updatedAt_7 as updatedAt };
    }
    namespace ProductCategoryMappingScalarFieldEnum {
        let id_8: string;
        export { id_8 as id };
        let productId_6: string;
        export { productId_6 as productId };
        let categoryId_1: string;
        export { categoryId_1 as categoryId };
        let isPrimary_1: string;
        export { isPrimary_1 as isPrimary };
        let createdAt_8: string;
        export { createdAt_8 as createdAt };
    }
    namespace SortOrder {
        let asc: string;
        let desc: string;
    }
    namespace NullableJsonNullValueInput {
        import DbNull = Prisma.DbNull;
        export { DbNull };
        import JsonNull = Prisma.JsonNull;
        export { JsonNull };
    }
    namespace JsonNullValueInput {
        import JsonNull_1 = Prisma.JsonNull;
        export { JsonNull_1 as JsonNull };
    }
    namespace QueryMode {
        let _default: string;
        export { _default as default };
        export let insensitive: string;
    }
    namespace JsonNullValueFilter {
        import DbNull_1 = Prisma.DbNull;
        export { DbNull_1 as DbNull };
        import JsonNull_2 = Prisma.JsonNull;
        export { JsonNull_2 as JsonNull };
        import AnyNull = Prisma.AnyNull;
        export { AnyNull };
    }
    namespace NullsOrder {
        let first: string;
        let last: string;
    }
    namespace ModelName {
        let Product: string;
        let ProductVariant: string;
        let ProductImage: string;
        let ProductTag: string;
        let Category: string;
        let Artisan: string;
        let ProductInventory: string;
        let ProductReview: string;
        let ProductCategoryMapping: string;
    }
}
export namespace $Enums {
    namespace ProductStatus {
        let DRAFT: string;
        let ACTIVE: string;
        let INACTIVE: string;
        let DISCONTINUED: string;
    }
    namespace ProductAvailability {
        let IN_STOCK: string;
        let OUT_OF_STOCK: string;
        let MADE_TO_ORDER: string;
        let SEASONAL: string;
    }
    namespace ArtisanStatus {
        export let PENDING: string;
        export let VERIFIED: string;
        export let SUSPENDED: string;
        let INACTIVE_1: string;
        export { INACTIVE_1 as INACTIVE };
    }
    namespace ReviewStatus {
        let PENDING_1: string;
        export { PENDING_1 as PENDING };
        export let APPROVED: string;
        export let REJECTED: string;
        export let FLAGGED: string;
    }
}
export namespace ProductStatus {
    let DRAFT_1: string;
    export { DRAFT_1 as DRAFT };
    let ACTIVE_1: string;
    export { ACTIVE_1 as ACTIVE };
    let INACTIVE_2: string;
    export { INACTIVE_2 as INACTIVE };
    let DISCONTINUED_1: string;
    export { DISCONTINUED_1 as DISCONTINUED };
}
export namespace ProductAvailability {
    let IN_STOCK_1: string;
    export { IN_STOCK_1 as IN_STOCK };
    let OUT_OF_STOCK_1: string;
    export { OUT_OF_STOCK_1 as OUT_OF_STOCK };
    let MADE_TO_ORDER_1: string;
    export { MADE_TO_ORDER_1 as MADE_TO_ORDER };
    let SEASONAL_1: string;
    export { SEASONAL_1 as SEASONAL };
}
export namespace ArtisanStatus {
    let PENDING_2: string;
    export { PENDING_2 as PENDING };
    let VERIFIED_1: string;
    export { VERIFIED_1 as VERIFIED };
    let SUSPENDED_1: string;
    export { SUSPENDED_1 as SUSPENDED };
    let INACTIVE_3: string;
    export { INACTIVE_3 as INACTIVE };
}
export namespace ReviewStatus {
    let PENDING_3: string;
    export { PENDING_3 as PENDING };
    let APPROVED_1: string;
    export { APPROVED_1 as APPROVED };
    let REJECTED_1: string;
    export { REJECTED_1 as REJECTED };
    let FLAGGED_1: string;
    export { FLAGGED_1 as FLAGGED };
}
export namespace Prisma {
    export namespace prismaVersion {
        let client: string;
        let engine: string;
    }
    export function PrismaClientKnownRequestError(): never;
    export function PrismaClientUnknownRequestError(): never;
    export function PrismaClientRustPanicError(): never;
    export function PrismaClientInitializationError(): never;
    export function PrismaClientValidationError(): never;
    export { Decimal };
    export function sql(): never;
    export function empty(): never;
    export function join(): never;
    export function raw(): never;
    export let validator: typeof Public.validator;
    export function getExtensionContext(): never;
    export function defineExtension(): never;
    let DbNull_2: {
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    export { DbNull_2 as DbNull };
    let JsonNull_3: {
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    export { JsonNull_3 as JsonNull };
    let AnyNull_1: {
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    export { AnyNull_1 as AnyNull };
    export namespace NullTypes {
        let DbNull_3: {
            new (arg?: symbol): {
                _getNamespace(): string;
                _getName(): string;
                toString(): string;
            };
        };
        export { DbNull_3 as DbNull };
        let JsonNull_4: {
            new (arg?: symbol): {
                _getNamespace(): string;
                _getName(): string;
                toString(): string;
            };
        };
        export { JsonNull_4 as JsonNull };
        let AnyNull_2: {
            new (arg?: symbol): {
                _getNamespace(): string;
                _getName(): string;
                toString(): string;
            };
        };
        export { AnyNull_2 as AnyNull };
    }
}
export class PrismaClient {
}
import { Decimal } from "./runtime/index-browser.js";
import { Public } from "./runtime/index-browser.js";
//# sourceMappingURL=index-browser.d.ts.map