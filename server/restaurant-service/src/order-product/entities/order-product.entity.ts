import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Table({
    tableName: 'order_products'
})
export class OrderProduct extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    quantity: number;

    @Column
    price: number;

    @CreatedAt
    createdAt: Date = new Date();

    @UpdatedAt
    updatedAt: Date = new Date();

    @ForeignKey(() => Product)
    @Unique
    @Column
    productId: number;

    @BelongsTo(() => Product)
    product: Product;

    @ForeignKey(() => Order)
    @Unique
    @Column
    orderId: number;

    @BelongsTo(() => Order)
    order: Order;
}