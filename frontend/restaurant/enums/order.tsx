export enum OrderStatuses {
    CREATED = 'CREATED', // created from end user
    RESTAURANT_NOTIFIED = 'RESTAURANT_NOTIFIED', // restaurant is notified for the new order
    RESTAURANT_RECEIVED = 'RESTAURANT_RECEIVED', // received by restaurant
    RESTAURANT_CONFIRMED = 'RESTAURANT_CONFIRMED', // restaurant confirmed delivery interval, e.g. in 60 minutes
    PICKUP_READY = 'PICKUP_READY', // food is prepared, awaiting pickup from delivery
    PICKUP_INPROGRESS = 'PICKUP_INPROGRESS', // currently in delivery
    DELIVERED = 'DELIVERED'
}