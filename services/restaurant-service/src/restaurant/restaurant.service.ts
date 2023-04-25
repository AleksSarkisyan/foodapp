import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { Op } from 'sequelize';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';
import { MapquestService } from 'src/mapquest/mapquest.service';


@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private userService: UserService,
    private mapQuestService: MapquestService
  ) { }
  async create(createRestaurantDto: Types.Restaurant.CreateRestaurantDto) {
    let { id: userId } = await this.userService.getUserFromToken(createRestaurantDto.token);
    createRestaurantDto.userId = userId;

    return this.restaurantModel.create({ ...createRestaurantDto });
  }

  async update(updateRestaurantDto: Types.Restaurant.UpdateRestaurantDto) {
    let { id: userId } = await this.userService.getUserFromToken(updateRestaurantDto.token);

    return await this.restaurantModel.update(
      { ...updateRestaurantDto },
      {
        where: {
          userId,
          id: updateRestaurantDto.restaurantId
        }
      });
  }

  async findAll() {
    return this.restaurantModel.findAll({
      attributes: ['id', 'name', 'city', 'menuId'],
      where: {
        menuId: {
          [Op.not]: null
        }
      }
    });
  }

  async findOne(restaurantId: number) {
    return this.restaurantModel.findOne({
      attributes: ['userId'],
      where: {
        id: restaurantId,
      },
    });
  }

  async clientSearch(clientSearchDto: { location: string }) {
    /* 1 Geocode address */
    const geoCode = await this.mapQuestService.geoCodeAddress(clientSearchDto)
    const { locations } = geoCode[0]

    /* 2 Extract different admin areas  */
    const { adminArea3, adminArea4, adminArea5, adminArea6 } = locations[0];
    const adminAreas = [adminArea3, adminArea4, adminArea5, adminArea6];

    /* 3 Find restaurants */
    const restaurants: Restaurant[] = await this.restaurantModel.findAll({
      where: {
        city: {
          [Op.in]: adminAreas
        },
        [Op.or]: [{
          maxDeliveryTime: {
            [Op.not]: null
          }
        }, {
          maxDeliveryDistance: {
            [Op.not]: null
          }
        }]
      },
      raw: true
    });

    if (!restaurants.length) {
      return this.errorMessage('Did not find any restaurants')
    }

    let addresses: Array<string> = []
    /*4 Set client address as the 1st one */
    addresses.push(clientSearchDto.location)

    /* 5 Push all other restaurant addresses */
    for (const restaurant of Object.entries(restaurants)) {
      addresses.push(restaurant[1].address)
    }

    if (!addresses.length) {
      return this.errorMessage('Error finding addresses.')
    }

    /* 6 Get distance and time from client address to every restaurant address */
    let matrix = await this.mapQuestService.routeMatrix(addresses)
    let availableRestaurants: Restaurant[] = [];
    let distances: Array<number> = matrix.distance.slice(1);
    let time: Array<number> = matrix.time.slice(1);

    /* 7 Return restaurants within range */
    restaurants.find((rest, index) => {
      if (rest.maxDeliveryDistance && (distances[index] <= rest.maxDeliveryDistance)) {
        availableRestaurants.push(rest)
      }

      if (rest.maxDeliveryTime && (time[index] <= rest.maxDeliveryTime)) {
        availableRestaurants.push(rest)
      }
    })

    return availableRestaurants;
  }

  async getRestaurantsByUserId(getRestaurantsByUserIdDto: { token: string }) {
    let { id: userId } = await this.userService.getUserFromToken(getRestaurantsByUserIdDto.token);

    const restaurants: Restaurant[] = await this.restaurantModel.findAll({
      where: {
        userId,
      },
    });

    return restaurants;
  }

  errorMessage(message: string) {
    Logger.log(message);
    return {
      error: true,
      message
    }
  }
}
