import { CreateRestaurantDto } from "./create-restaurant.dto";

export type UpdateRestaurantDto = Omit<CreateRestaurantDto, "userId"> & {
    restaurantId: number;
    token: string;
}