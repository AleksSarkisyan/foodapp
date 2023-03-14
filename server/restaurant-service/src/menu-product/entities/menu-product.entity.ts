import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Menu } from '../../menu/entities/menu.entity';

@Table({
    tableName: 'menus_products'
})
export class MenuProduct extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @CreatedAt
    createdAt: Date = new Date();

    @UpdatedAt
    updatedAt: Date = new Date();

    @ForeignKey(() => User)
    @Unique
    @Column
    userId: number;

    @ForeignKey(() => Product)
    @Unique
    @Column
    productId: number;

    @ForeignKey(() => Menu)
    @Unique
    @Column
    menuId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Menu)
    menu: Menu;

    @BelongsTo(() => Product)
    product: Product;
}