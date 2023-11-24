import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useContext } from "react";
import { getSession } from "next-auth/react";
import { CategoryProducts, Products } from "../../types/category-products";
import { NextRestaurantPageProps } from "../../types/restaurant";
import { RestaurantQueryParams } from "../../types/restaurant";
import { AddToCartParams } from "../../types/cart";
import { ModalContext } from "../../context/modalConext";
import { Cart } from "../../components/cart/cart";
import { useRouter } from "next/router";

const Restaurant: NextPage<NextRestaurantPageProps> = ({ categoryProducts, error }): JSX.Element => {

    let { handleModal, modal }: any = useContext(ModalContext);
    const router = useRouter()
    const { id: restaurantId } = router.query;

    useEffect(() => {
        if (!modal) {
            clearCart();
        }
    }, [!modal]);

    useEffect(() => {
        const handleRouteChange = () => {
            clearCart();
        }

        router.events.on('routeChangeStart', handleRouteChange)

        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, []);

    const clearCart = async () => {
        let clear = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart/clear`);
        await clear.json();
        handleModal();
    }

    const createOrder = async () => {
        let body = JSON.stringify({
            restaurantId
        });

        let createOrder = await fetch(`${process.env.NEXT_PUBLIC_API_URL}private/order/create`, { body, method: 'POST' })
        let createOrderResult = await createOrder.json();

        let { stripeRedirectUrl } = createOrderResult

        if (stripeRedirectUrl) {
            window.location.assign(stripeRedirectUrl)
        }
    }

    const addToCart = async ({ productId, quantity, price, name, weight }: AddToCartParams) => {
        let body = JSON.stringify({
            productId,
            quantity,
            price,
            name,
            weight
        });

        let addToCart = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cart/add`, { body, method: 'POST' })
        let addToCartResult = await addToCart.json();

        handleModal(<Cart products={JSON.parse(addToCartResult.products)} createOrder={() => createOrder()} />)
    }

    return <div>
        {error && error}
        {categoryProducts.length > 0 && <div>
            {categoryProducts.map((categories: CategoryProducts, key: number) => (
                <div key={'category' + key}>
                    <strong style={{ padding: '0px 10px' }}>{categories.categoryName}</strong>
                    {categories.products.length > 0 && <div>
                        {categories.products.map((product: Products, productKey: number) => (
                            <div
                                key={'product' + productKey}
                                style={{ border: '1px solid', margin: '10px', padding: '0px 10px', cursor: 'pointer' }}
                                onClick={() => addToCart({
                                    productId: product.productId,
                                    quantity: 1,
                                    price: product.price,
                                    name: product.name,
                                    weight: product.weight
                                })}
                            >
                                <p>ID: {product.productId}</p>
                                <p>Name: {product.name}</p>
                                <p>Description: {product.description}</p>
                                <p>Price: {product.price}</p>
                                <p>Weight: {product.weight}</p>
                            </div>
                        ))}
                    </div>}
                </div>
            ))}
        </div>}
    </div>
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {

    let session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false
            }
        }
    }

    const { id } = params as RestaurantQueryParams;

    let categoryProducts = await fetch(`${process.env.NEXT_API_URL}restaurant/${id}`)
    let categoryProductsResult: CategoryProducts[] = await categoryProducts.json();

    if (!categoryProductsResult.length) {
        return {
            props: {
                error: 'No products found'
            }
        }
    }

    return {
        props: {
            categoryProducts: categoryProductsResult
        }
    }

}

export default Restaurant;