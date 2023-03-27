import { Database } from '@asarkisyan/nestjs-foodapp-shared';
import { Column, Model, Table, PrimaryKey, CreatedAt, UpdatedAt, Unique, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: Database.TABLE_NAME_USERS
})
export class User extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Unique
    @Column
    name: string;

    @Unique
    @Column
    email: string;

    @Column
    password: string;

    @CreatedAt
    createdAt: Date = new Date();

    @UpdatedAt
    updatedAt: Date = new Date();
}