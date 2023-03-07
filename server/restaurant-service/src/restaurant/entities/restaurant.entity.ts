import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

@Table({
    tableName: 'restaurants'
})
export class Restaurant extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    menuId: number;

    @Unique
    @Column
    name: string;

    @Unique
    @Column
    city: string;

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
}