export class ProductDto {
    id: number;
    userId: number;
    stripeId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    stripePrice: string;
    promoPrice: number;
    imageUrl: string;
    slug: string;
    weight: string;
    isPromo: boolean
    isActive: boolean;
}