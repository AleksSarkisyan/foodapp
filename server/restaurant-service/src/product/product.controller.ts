import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern({ cmd: Enums.Product.Commands.CREATE_PRODUCT })
  @UsePipes(new JoiValidationPipe(Types.Product.createProductSchema))
  create(@Payload() createProductDto: Types.Product.CreateProductDto) {
    return this.productService.create(createProductDto);
  }
}
