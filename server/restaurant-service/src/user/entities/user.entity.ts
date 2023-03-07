import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Table({
    tableName: 'user'
})
export class User extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Unique
    @Column
    email: string;

    @Column
    password: string;

    @CreatedAt
    createdAt: Date = new Date();

    @UpdatedAt
    updatedAt: Date = new Date();

    @HasMany(() => Restaurant)
    restaurants: Restaurant[];
}