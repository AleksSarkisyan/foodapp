import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Post('create')
  create(@Body() createProductDto: CreateProductDto, @Headers() headers) {
    createProductDto.token = headers['authorization'];
    return this.productService.create(createProductDto);
  }
}
