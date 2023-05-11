import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { CategoryProducts, Products } from "../../types/category-products";
import { NextRestaurantPageProps } from "../../types/restaurant";
import { RestaurantQueryParams } from "../../types/restaurant";
import { AddToCartParams } from "../../types/cart";


const Restaurant: NextPage<NextRestaurantPageProps> = ({ categoryProducts, error }): JSX.Element => {

    useEffect(() => {
    }, []);

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

        console.log('addToCartResult is', addToCartResult)
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

    let clearCart = await fetch(`${process.env.NEXT_API_URL}cart/clear`, req as RequestInit);
    let clearCartResult = await clearCart.json();
    console.log('got clearCartResult', clearCartResult)

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