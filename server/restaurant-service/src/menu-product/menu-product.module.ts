import { Module } from '@nestjs/common';
import { MenuProductService } from './menu-product.service';
import { MenuProductController } from './menu-product.controller';
import { MenuProduct } from './entities/menu-product.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forFeature([MenuProduct]),
  ],
  controllers: [MenuProductController],
  providers: [MenuProductService],
  exports: [MenuProductService]
})
export class MenuProductModule { }
