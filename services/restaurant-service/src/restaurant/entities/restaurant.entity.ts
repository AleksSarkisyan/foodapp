import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Menu } from 'src/menu/entities/menu.entity';
import { User } from 'src/user/entities/user.entity';

@Table({
    tableName: 'restaurants'
})
export class Restaurant extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Unique
    @Column
    name: string;

    @Unique
    @Column
    city: string;

    @Column
    address: string;

    @Column
    maxDeliveryDistance: number;

    @Column
    maxDeliveryTime: number;

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

    @ForeignKey(() => Menu)
    @Column
    menuId: number;

    @BelongsTo(() => Menu)
    menu: Menu;
}