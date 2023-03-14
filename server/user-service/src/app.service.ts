import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
// Import EntityManager from your driver package or `@mikro-orm/knex`
// import { EntityManager } from '@mikro-orm/mysql';

@Injectable()
export class AppService {
  constructor(
    // private readonly orm: MikroORM,
    // private readonly em: EntityManager,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
}
