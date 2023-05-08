export type Restaurant = {
    id: number;
    name: string;
    address: string;
    city: string;
    userId: number;
    menuId: number;
}

export type Restaurants = {
    restaurants: Restaurant[];
}