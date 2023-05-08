import { NextApiRequest, NextPage } from "next";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;
const Order: NextPage = ({ apiResult, initSocket, message }: any): JSX.Element => {
    const { status, data } = useSession();
    const [connected, setConnected] = useState<boolean>(false);
    const [orderConfirmed, setOrderConfirmed] = useState({ message: null });

    useEffect(() => {
        if (status === "unauthenticated") {
            Router.replace("/auth/signin");
        }
    }, [status]);

    useEffect(() => {
        socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

        socket.on("connect", () => {
            socket.on("orderConfirmed", (message: any) => {
                setOrderConfirmed({ message })
            });
        });
    }, []);

    return (
        <div>
            This page is Protected for special people like{"\n"}
            {JSON.stringify(data?.user?.name, null, 2)} <br />
            {apiResult && apiResult.message}
            {orderConfirmed.message && (
                <div>Restaurant confirmed your order {orderConfirmed.message}</div>
            )}
        </div>
    );
};

export default Order;

export async function getServerSideProps({ req }: any) {
    const products = [
        {
            "productId": 6,
            "quantity": 2
        },
        {
            "productId": 4,
            "quantity": 1
        },
        {
            "productId": 5,
            "quantity": 1
        },
        {
            "productId": 79,
            "quantity": 3
        }
    ];
    const orderData = {
        products,
        restaurantId: 7
    }

    req.body = JSON.stringify(orderData);
    req.method = 'POST';

    let createOrder = await fetch(`${process.env.NEXT_API_URL}createOrder`, req)
    let createOrderResult = await createOrder.json();

    /** Got an error */
    if (!createOrderResult || !createOrderResult.apiResult) {
        let { apiResult } = createOrderResult

        return {
            props: {
                apiResult
            }
        };
    }

    /** Got a successful response */
    let redirectUrl = createOrderResult.apiResult.stripeRedirectUrl;

    if (!redirectUrl) {
        return {
            props: {

            }
        }
    }

    return {
        props: {
            redirectUrl
        },
        redirect: {
            destination: redirectUrl,
            permanent: false,
        },
    };
}
