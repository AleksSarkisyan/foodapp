## Project Description 
This project represents a food ordering web application built with Nest.js and Next.js. The functionality is split between two systems - a restaurant-users site for CRUD operations (Postman endpoints) where users can register & login, manage their restaurants, products, menus, asssign products to menus, choose restaurant menu, etc.
The other site is for end-users that can register & login, look up restaurants, add & remove products from their cart and make food orders. Orders are processed with Stripe and a websocket notification is sent to the restaurant if the order was successful. Websocket notification is also sent back to the end-user when a restaurant confirms the order.
Each frontend communicates with a separate API gateway which communicates with one or more microservices via Redis pub/sub. Each microservice has access to its own MySql DB.

## Idea and Motivation
The initial plan was to explore and play around with Nest js as a solid and promising backend framework. However, with time, I wanted to also include a frontend framework in order to consume what I built. I decided to use Next js to accomplish that as it offers many advantages compared to using a traditional React app. Both websites use minimal amount of markup & styling as I did not want to focus on that. Ultimately, I hope this repo and the patterns used here help you out in your journey, inspire you to learn, explore and grow in your carreer.

## Technologies Used
These are the main packages are used accross the app:
- [Next js](https://nextjs.org/)
- [Nest js](https://nestjs.com/)
- [Next Auth](https://next-auth.js.org/)
- [Passport](https://www.passportjs.org/)
- [Redis](https://github.com/redis/ioredis#readme)
- [Sequelize](https://sequelize.org/)
- [Joi](https://github.com/hapijs/joi#readme),
- MySql, TypeScript

## Project Structure
 - frontend/client - Next js site used by end users only, e.g. search restaurants, add to cart, create orders
 - frontend/restaurant - Next js site used by restaurant users only, e.g. receive orders and manage products
 - http-client-api - Nest js API gateway used by frontend/client
 - http-restaurant-api - Nest js API gateway used by frontend/restaurant
 - services/user-service -  Nest js microservice that communicates with http-client-api to create user, create and store JWT
 - services/restaurant-service -  Nest js microservice that communicates with http-restaurant-api to create user, CRUD operations for products, menus, categories, etc.
 - services/payment-service - Nest js microservice responsible for handling payments
 - services/shared-service - a shared [npm library](https://www.npmjs.com/package/@asarkisyan/nestjs-foodapp-shared) used accross project, not a microservice per se

## End-users Site Architecture Diagram 
[Yeah, I know, it could look better :D](./foodapp_architectureDiagram.xml)

## Features & Patterns
### End-users Site
 - Authorization is handled by creating a JWT using [Passport](https://docs.nestjs.com/recipes/passport). Unlike other implementations, the Passport JWT never gets to the client. Instead a short-lived opaque (a.ka. reference) token is created, stored in Redis and returned to the client. Additionally, a long-lived refresh token is created and stored in Redis. Client receives the opaque token and a creation timestamp. Then [Next-auth](https://next-auth.js.org/) stores that in it's own JWT and session. When client needs to access a private API route, the opaque token is retrieved from Redis and compared with the opaque token in the Next auth session. Timestamp is compared in the next-auth JWT callback which can trigger a refresh token call. In that case the login flow starts over, without having to re-enter credentials.
 - Communication between client and server is handled by using the [API Gateway](https://microservices.io/patterns/apigateway.html) pattern. Each gateway acts as a [orchestrator](https://www.architect.io/blog/2022-06-30/microservices-orchestration-primer/) when talking to microservices. Messages that are sent between the gateway and microservice are handled with [Redis Pub-Sub](https://docs.nestjs.com/microservices/redis).
- Search experience uses [Mapquest API](https://developer.mapquest.com/user/login) to look up nearby restaurants by entering a city and street where food should be delivered. By default, each restaurant can choose to deliver by either max delivery distance from address or max delivery time from address [Route Matrix](https://developer.mapquest.com/documentation/directions-api/route-matrix/post/). This way a restaurant could limit delivering food to far-away addresses, thus search won't return it.
 - Cart logic is implemented in a Next private API route. It stores the added products in Redis. Adding/removing products does not hit the Gateway or DB.
 - Creating an order has a lot of steps. Check comments at http-client-api/src/order/order.service.ts
 - Order notifications rely on using a websocket. If Stripe payment is successful, [Test Cards](https://stripe.com/docs/testing), the gateway will emit an order created event and user will be redirected to a /success page. Restaurant user will be [polling](https://github.com/socketio/socket.io-client#readme) for that event. Restaurant can confirm the order and in that case the end-user will receive notification as well.

### Restaurant-users site
 - As of right now, everything related to the CRUD operations in the admin panel is available through the [Nest API endpoints](./FoodAPP%20Nest%20Restaurant.postman_collection.json) only. When logged in, the UI will show the restaurants that the user owns. When navigating to a specific restaurant the user could see the orders coming in and confirm them.
 - Communication uses the same pattern as end-users iste
 - Authorization in this site is still using the previous implementation - Passport JWT gets to the client and Next-auth.

## Installation
 - run npm install in each folder
 - change the values in the .env files to match your local setup (remember to never upload those in a real project!)
 - create a database for [end-users](./services/user-service/schema.sql) and a different one for [restaurants](./services/restaurant-service/schema.sql) and execute the scripts. Optionally import [restaurants mock data](./services/restaurant-service/mockData/) and [end-users mock data](./services/user-service/mockData/)
 - for Next use npm run dev
 - for Nest use npm run start:dev