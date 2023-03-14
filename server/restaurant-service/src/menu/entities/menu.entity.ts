import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { MenuProduct } from 'src/menu-product/entities/menu-product.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Table({
    tableName: 'menus'
})
export class Menu extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Unique
    @Column
    name: string;

    @Column
    city: string;

    @Column
    description: string;

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

    @BelongsToMany(() => Product, () => MenuProduct)
    products: Product[]
}