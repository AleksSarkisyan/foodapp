import { CategoryProducts } from "./category-products";
import { ParsedUrlQuery } from "querystring";

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

export type Error = {
    error: string;
}

export type NextRestaurantPageProps = {
    categoryProducts: CategoryProducts[];
    error: string;
};

export interface RestaurantQueryParams extends ParsedUrlQuery {
    id: string;
}
