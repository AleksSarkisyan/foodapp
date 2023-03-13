import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto, createProductSchema } from './dto/create-product.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern({ cmd: 'createProduct' })
  @UsePipes(new JoiValidationPipe(createProductSchema))
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
}
