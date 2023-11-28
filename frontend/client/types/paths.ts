

const privatePath = 'private/';

export enum NextApiPaths {
    ADD_TO_CART = `${privatePath}cart/add`,
    REMOVE_CART = `${privatePath}cart/clear`,
    CREATE_ORDER = `${privatePath}order/create`
}