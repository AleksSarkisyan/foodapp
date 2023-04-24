import { NextApiRequest, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";


const Order: NextPage = ({ apiResult, initSocket }: any): JSX.Element => {
    const { status, data } = useSession();
    const [connected, setConnected] = useState<boolean>(false);

    console.log('initSocket--', initSocket)

    useEffect(() => {
        if (status === "unauthenticated") {
            Router.replace("/auth/signin");
        }
    }, [status]);

    return (
        <div>
            This page is Protected for special people like{"\n"}
            {JSON.stringify(data?.user?.name, null, 2)} <br />
            {apiResult && apiResult.message}
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

    console.log('createOrderResult is', createOrderResult)

    /** WS testing */
    let initSocket = false;
    if (createOrderResult.apiResult.success) {
        initSocket = true

        const socket = io("http://localhost:3001");

        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);

            socket.on('orderCreated', msg => {
                console.log('got message...', msg)
            })

            socket.on("onMessage", (message: any) => {
                console.log('got onMessage', message)
            });

            socket.emit("orderReceivedByRestaurant", JSON.stringify({ status: 'orderCreated by user...' }));
            socket.emit("test", JSON.stringify({ status: 'this is a test' }));
        });

        socket.emit("orderCreated", JSON.stringify({ status: 'orderCreated by user...' }));

        socket.on("orderReceivedByRestaurant2", (message: any) => {
            console.log('got message000', message)
        });

        return {
            props: {
                initSocket
            }
        }
    }

    /** Got an error */
    if (!createOrderResult || !createOrderResult.apiResult) {
        let { apiResult } = createOrderResult

        console.log('apiResult is---', apiResult)
        return {
            props: {
                apiResult
            }
        };
    }

    /** Got a successful response */
    let redirectUrl = createOrderResult.apiResult.stripeRedirectUrl;

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
