import { Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Transport } from '@nestjs/microservices';

export const RestaurantClientModuleOptions = {
    name: Enums.Restaurant.Generic.SERVICE_NAME,
    transport: Transport.REDIS as Transport.REDIS,
    options: {
        host: 'localhost',
        port: 6379
    }
};

export const UserCliemtModuleOptions = {
    name: Enums.User.Generic.SERVICE_NAME,
    transport: Transport.REDIS as Transport.REDIS,
    options: {
        host: 'localhost',
        port: 6379
    }
}

export const PaymentCliemtModuleOptions = {
    name: Enums.Payment.Generic.SERVICE_NAME,
    transport: Transport.REDIS as Transport.REDIS,
    options: {
        host: 'localhost',
        port: 6379
    }

}