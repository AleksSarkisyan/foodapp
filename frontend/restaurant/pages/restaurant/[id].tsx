import type { NextPage } from "next";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getSession } from "next-auth/react";


let socket: any;
const Restaurant: NextPage = (): JSX.Element => {
    const router = useRouter()
    const { id } = router.query;
    const [message, setMessage] = useState({ message: null, order: { totalQuantity: null, totalPrice: null, id: 0 } });

    useEffect(() => {
        socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);

            socket.on('orderCreated', (msg: any) => {
                let message = JSON.parse(msg);
                console.log('got order', message)

                if (message.order.restaurantId == id) {
                    setMessage({ message: message.message, order: message.order })
                }
            })
        });
    }, []);

    const confirmOrder = (orderNumber: number) => {
        socket.emit("orderConfirmed", JSON.stringify({ message: 'orderConfirmed', orderNumber }));
    }
    return <div>

        {message.message && (<div>
            <p>New order received:</p>
            <div onClick={() => confirmOrder(message.order.id)}>{message.message} - Click to confirm</div>
            {/* <p>Total quantity: {message.order.totalQuantity}</p>
            <p>Total price: {message.order.totalPrice}</p> */}
        </div>)}
    </div>
}

export async function getServerSideProps({ req }: any) {
    let session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }

}

export default Restaurant;