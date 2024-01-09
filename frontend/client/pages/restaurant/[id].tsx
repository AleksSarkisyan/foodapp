import type { NextPage } from "next";
import { useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { CategoryProducts, Products } from "@/types/category-products";
import { NextRestaurantPageProps } from "@/types/restaurant";
import { AddToCartParams } from "@/types/cart";
import { ModalContext } from "../../context/modalConext";
import { Cart } from "../../components/cart/cart";
import { useRouter } from "next/router";
import { NextApiPaths } from '@/types/paths';
import { getServerSideData } from "@/services/getServerSideData";
import type { GetServerSidePropsContext } from 'next';

const Restaurant: NextPage<NextRestaurantPageProps> = ({ categoryProducts, error }): JSX.Element => {
    let { handleModal, modal }: any = useContext(ModalContext);
    const router = useRouter()
    const { id: restaurantId } = router.query;
    const { data: session, update } = useSession();

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
        if (!session) {
            return;
        }

        let clear = await fetch(getUrl(NextApiPaths.REMOVE_CART));
        let clearResult = await clear.json();

        if (clearResult.error) {
            return;
        }

        handleModal();
    }

    const createOrder = async () => {
        if (!session) {
            return;
        }

        let body = JSON.stringify({
            restaurantId
        });

        let createOrder = await fetch(getUrl(NextApiPaths.CREATE_ORDER), { body, method: 'POST' })
        let createOrderResult = await createOrder.json();

        let { stripeRedirectUrl } = createOrderResult

        if (stripeRedirectUrl) {
            window.location.assign(stripeRedirectUrl)
        }
    }

    const addToCart = async ({ productId, quantity, price, name, weight }: AddToCartParams) => {
        if (!session) {
            return;
        }

        let body = JSON.stringify({
            productId,
            quantity,
            price,
            name,
            weight
        });

        let addToCart = await fetch(getUrl(NextApiPaths.ADD_TO_CART), { body, method: 'POST' })
        let addToCartResult = await addToCart.json();
        
        return handleModal(<Cart products={JSON.parse(addToCartResult.products)} createOrder={() => createOrder()} />)
    }

    const getUrl = (path: NextApiPaths) => {
        return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
    }

    return <div>
        {error && error}
        <div>Hello {session?.user?.name}</div>
        {categoryProducts && categoryProducts.length > 0 && <div>
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

/** May not work well with hot reload while developing */
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const data = await getServerSideData(context, ['getRestaurantMenuProps', 'otherProps'])

    if (data[0].hasOwnProperty('redirect')) {
        return data[0];
    }
   
    return {
        props: data[0]
    };
}


export default Restaurant;