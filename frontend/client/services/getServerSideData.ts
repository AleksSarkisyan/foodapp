import { CategoryProducts } from "@/types/category-products";
import { RestaurantNotifiedResult } from "@/types/restaurant";
import type { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from "querystring";
import { verifyToken } from "@/services/verifyToken";
import { VerifyTokenResult, AuthFailed } from '@/types/user';

/** HOC that will verify the token and make any initial API calls on page load  */
export async function getServerSideData (context: GetServerSidePropsContext, apiCalls: string[]) {
    const { error } = await verifyToken(context.req, context.res) as VerifyTokenResult;
    
    if (error) {
        let data: AuthFailed[] = [{
            redirect: {
                destination: '/auth/signin',
                permanent: false
            }
        }];

        return data;
    }

    if (!apiCalls) {
        return [];
    }
    
    return await callApis([...apiCalls], context);
}

/** Wrapper function that can call different API resources, depending on provided keys */
const callApis = async(types: string[], context: GetServerSidePropsContext) => {
    let apiFunctions: { [key: string]: any } = [
        {'getRestaurantMenuProps': getRestaurantMenuProps(context.params)},
        {'otherProps': otherProps()},
        {'notifyRestaurantProps': notifyRestaurantProps(context)}
    ];
    
    let result: CategoryProducts[] | RestaurantNotifiedResult[] | AuthFailed[] = [];

    for await (const [key, apiCall] of Object.entries(apiFunctions)) {
        let functionName = Object.keys(apiCall)[0];
        
        if (types.includes(functionName)) {
            
            /** Makes the actual api call */
            let data = await apiCall[functionName]
            result.push(data);
        }
    }

    return result;
}

const getRestaurantMenuProps = async (params: ParsedUrlQuery | undefined) => {
    if (params) {
        const { id } = params;
        let categoryProducts = await fetch(`${process.env.NEXT_API_URL}restaurant/${id}`)
        let categoryProductsResult: CategoryProducts[] = await categoryProducts.json();
        
        if (!categoryProductsResult.length) {
            return {
                error: 'No products found'
            }
        }

        return {
            categoryProducts: categoryProductsResult
        }
    }
    
    return { 
        categoryProducts: []
    }
}

const otherProps = async () => {
    let someData = [];
    someData.push('just for test')

    return someData;
}

const notifyRestaurantProps = async (context: GetServerSidePropsContext) => {
    let notifyRestaurant = await fetch(`${process.env.NEXT_API_URL}private/order/notify-restaurant`, context.req as any)
    let notifyRestaurantResult = await notifyRestaurant.json();

    let restaurantNotified = false;
    let restaurantName = null;

    if (notifyRestaurantResult && notifyRestaurantResult.order) {
        restaurantNotified = true
        restaurantName = notifyRestaurantResult.order.restaurantName;
    }

    return {
        restaurantNotified,
        restaurantName
    }
}