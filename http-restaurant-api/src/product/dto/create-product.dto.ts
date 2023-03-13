export class CreateProductDto {
    userId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    promoPrice: number;
    imageUrl: string;
    slug: string;
    weight: string;
    isPromo: boolean
    isActive: boolean;
    token: string;
}