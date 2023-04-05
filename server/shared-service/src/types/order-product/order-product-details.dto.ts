export type AvailableProducts = {
    id: number;
    stripeId: string;
    price: number;
    stripePrice: string;
    name: string;
    weight: string;
    description: string;
}

export type OrderProductDetails = {
    restaurantId: number;
    userId: number;
    restaurantUserId: number;
    productIds: [];
    totalQuantity: number;
    availableProducts: AvailableProducts[];
}