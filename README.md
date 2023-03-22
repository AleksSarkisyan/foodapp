# foodapp
NestJS food delivery app using microservices

# foodapp
NestJS food delivery API using microservices with async Redis pub/sub communication.
Uses http gateways as access points for creating orders and managing restaurants, menus and products.
Exposes a demo websocket client to notify restaurant of a new order creation.

Open terminal in each of the main folders:
http-client-api
http-restaurant-api
server/restaurant-service
server/user-service

Run the following in each

npm install
npm run start:dev
