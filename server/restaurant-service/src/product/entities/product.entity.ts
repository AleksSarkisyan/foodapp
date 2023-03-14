import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, BelongsTo, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuProduct } from 'src/menu-product/entities/menu-product.entity';

@Table({
    tableName: 'products'
})
export class Product extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Unique
    @Column
    name: string;

    @Column
    description: string;

    @Unique
    @Column
    price: number;

    @Column
    promoPrice: number;

    @Column
    imageUrl: string;

    @Column
    slug: string;

    @Unique
    @Column
    weight: string;

    @Column
    isPromo: boolean;

    @Column
    isActive: boolean;

    @CreatedAt
    createdAt: Date = new Date();

    @UpdatedAt
    updatedAt: Date = new Date();

    @ForeignKey(() => User)
    @Unique
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Category)
    @Unique
    @Column
    categoryId: number;

    @BelongsTo(() => Category)
    category: Category;

    @BelongsToMany(() => Menu, () => MenuProduct)
    menus: Menu[]

}