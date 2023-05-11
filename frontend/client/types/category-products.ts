export type Products = {
    id: number;
    productId: number;
    name: string;
    description: string;
    weight: string;
    price: number;
}

export type CategoryProducts = {
    categoryName: string;
    products: Products[];
}