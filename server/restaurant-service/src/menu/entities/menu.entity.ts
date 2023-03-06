import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement } from 'sequelize-typescript';

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
    userId: number;

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
}