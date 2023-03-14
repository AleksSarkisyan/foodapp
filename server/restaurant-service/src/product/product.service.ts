import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
JwtService

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private userService: UserService
  ) { }
  async create(createProductDto: CreateProductDto) {
    let { id } = await this.userService.getUserFromToken(createProductDto.token);

    createProductDto.userId = id;

    return this.productModel.create({ ...createProductDto });
  }

}
