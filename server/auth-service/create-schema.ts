import { MikroORM } from '@mikro-orm/core';
import { User } from './src/user/entities/user.entity';

(async () => {
    const orm = await MikroORM.init({
        entities: [User],
        dbName: 'auth_service',
        user: 'root',
        password: 'root',
        host: 'localhost',
        port: parseInt('3306', 10),
        type: 'mysql'
    });
    const generator = orm.getSchemaGenerator();

    const dropDump = await generator.getDropSchemaSQL();
    console.log(dropDump);

    const createDump = await generator.getCreateSchemaSQL();
    console.log(createDump);

    const updateDump = await generator.getUpdateSchemaSQL();
    console.log(updateDump);

    // there is also `generate()` method that returns drop + create queries
    // const dropAndCreateDump = await generator.generate();
    // console.log(dropAndCreateDump);

    // or you can run those queries directly, but be sure to check them first!
    await generator.dropSchema();
    await generator.createSchema();
    await generator.updateSchema();

    // in tests it can be handy to use those:
    await generator.refreshDatabase(); // ensure db exists and is fresh
    await generator.clearDatabase(); // removes all data

    await orm.close(true);
})();