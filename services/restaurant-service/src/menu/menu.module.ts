import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    CategoryModule,
    SequelizeModule.forFeature([Menu]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule { }
