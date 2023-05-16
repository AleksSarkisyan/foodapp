
export enum Routes {
    CREATE = 'create',
}

export enum Commands {
    CREATE_ORDER = 'createOrder',
    ORDER_RECEIVED_BY_RESTAURANT = 'orderReceivedByRestaurant'
}

export enum OrderStatuses {
    CREATED = 'created', // created from end user
    RECEIVED = 'received', // received by restaurant
    CONFIRMED = 'confirmed', // confirmed delivery interval, e.g. in 60 minutes
    PICKUP_READY = 'pickupReady', // food is prepared, awaiting pickup from delivery
    PICKUP_INPROGRESS = 'pickupInProgress', // currently in delivery
    DELIVERED = 'delivered'
}
