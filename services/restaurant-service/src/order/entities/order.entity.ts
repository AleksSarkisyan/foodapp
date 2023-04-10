import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Table({
    tableName: 'orders'
})
export class Order extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    userId: number;

    @Column
    totalQuantity: number;

    @Column
    totalPrice: number;

    @Column
    status: string;

    @CreatedAt
    createdAt: Date = new Date();

    @UpdatedAt
    updatedAt: Date = new Date();

    @ForeignKey(() => Restaurant)
    @Unique
    @Column
    restaurantId: number;

    @BelongsTo(() => Restaurant)
    restaurant: Restaurant;
}