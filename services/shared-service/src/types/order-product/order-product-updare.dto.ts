import { ProductDto } from "../product/product.dto";



export class OrderProductsUpdate extends ProductDto {
    productId: number;
    userId: number;
}
