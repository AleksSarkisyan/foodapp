import { NextApiRequest, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Router from "next/router";
import { NextRequest } from "next/server";
import { useEffect } from "react";
import { getToken } from 'next-auth/jwt'

const Token: NextPage = ({ apiResult }: any): JSX.Element => {
    const { status, data } = useSession();

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

export default Token;

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

    let createOrder = await fetch('http://localhost:3009/api/createOrder', req)

    let createOrderResult = await createOrder.json();

    if (!createOrderResult || !createOrderResult.apiResult) {
        let { apiResult } = createOrderResult

        console.log('apiResult is---', apiResult)
        return {
            props: {
                apiResult
            }
        };
    }

    let redirectUrl = createOrderResult.apiResult.stripeRedirectUrl;

    console.log('redirectUrl is---', redirectUrl)

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
