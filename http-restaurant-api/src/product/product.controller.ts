import { Controller, Post, Body, UseGuards, Headers, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(UserAuthorizedGuard(Enums.Restaurant.Generic.SERVICE_NAME))
  @Post('create')
  create(@Body() createProductDto: Types.Product.CreateProductDto, @Headers() headers) {
    try {
      createProductDto.token = headers['authorization'];
      return this.productService.create(createProductDto);
    } catch (error) {
      console.log('error is', error)
      Logger.log(error)
      return error;
    }
  }
}
