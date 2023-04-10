import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { Product } from './entities/product.entity';
import { Op } from 'sequelize';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private userService: UserService,
    private restaurantService: RestaurantService,
  ) { }
  async create(createProductDto: Types.Product.CreateProductDto) {

    let { id } = await this.userService.getUserFromToken(createProductDto.token);

    createProductDto.userId = id;

    return this.productModel.create({ ...createProductDto }).catch(e => { return new RpcException({ error: e.name, code: 500 }) });
  }

  async update(createProductDto: Partial<Types.Product.CreateProductDto>) {
    console.log('createProductDto is', createProductDto)
    let { id } = await this.userService.getUserFromToken(createProductDto.token);
    console.log('id is', id)
    createProductDto.userId = id;

    return this.productModel.update(
      { ...createProductDto },
      {
        where: {
          userId: id,
          id: createProductDto['productId']
        },
      }).catch(e => { console.log('error is', e); return new RpcException({ error: e, code: 500 }) })
  }

  async updateProductCheckout(productId, product) {
    console.log('product is', product)
    console.log('productId is', productId)


    return this.productModel.update(
      { ...product },
      {
        where: {
          id: productId
        },
      }).catch(e => { console.log('error is', e); return new RpcException({ error: e, code: 500 }) })
  }

  async findRestaurantProducts(findRestaurantProductsDto: Types.Product.FindRestaurantProductsDto) {
    let { restaurantUserId, productIds } = findRestaurantProductsDto;

    return this.productModel.findAll({
      where: {
        userId: restaurantUserId,
        id: {
          [Op.in]: productIds
        }
      },
    });
  }

  async updateProducts(productsData: Types.OrderProduct.AvailableProducts[], restaurantId: number, productIds: [], restaurantUserId: number) {

    let restaurant = await this.restaurantService.findOne(restaurantId)
    console.log('restaurantUserId is', restaurant.userId)
    console.log('productsData is', productsData)
    //return true;
    if (restaurant) {
      return this.productModel.bulkCreate(productsData, {
        updateOnDuplicate: ["id", 'stripeId', 'stripePrice', 'updated_at'],
      });
    }

    //return this.productModel.update(productsData);
  }

}
