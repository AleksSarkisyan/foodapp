type OrderProducts = {
    productId: number;
    quantity: number;
}

export class CreateOrderDto {
    userId: number;
    products: OrderProducts[];
    totalPrice: number;
    totalQuantity: number;
    restaurantId: number;
    token: string;
}
