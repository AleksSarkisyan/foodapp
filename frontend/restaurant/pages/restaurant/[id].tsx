import type { NextPage } from "next";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getSession } from "next-auth/react";


let socket: any;
const Restaurant: NextPage = (): JSX.Element => {
    const router = useRouter()
    const { id } = router.query;
    const [order, setOrder] = useState({ message: null, order: { total_quantity: null, total_price: null, id: 0, userEmail: null, restaurantId: null, restaurantName: null, created_at: null, status: null } });
    let [orderConfirmed, setOrderConfirmed] = useState(false);

    useEffect(() => {
        socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);

            socket.on('orderCreated', (msg: any) => {
                let message = JSON.parse(msg);

                if (message.order.restaurantId == id) {
                    setOrder({ message: message.message, order: message.order })
                }
            })
        });
    }, []);

    const confirmOrder = (orderNumber: number) => {
        socket.emit("orderConfirmed", JSON.stringify({ message: 'orderConfirmed', orderNumber, userEmail: order.order.userEmail }));
        setOrderConfirmed(true)
    }
    return <div>
        {order.message && !orderConfirmed && (<div>
            <table>
                <tr>
                    <th>Restaurant ID:</th>
                    <th>Restaurant Name:</th>
                    <th>Order ID:</th>
                    <th>Status:</th>
                    <th>Total Quantity:</th>
                    <th>Total Price:</th>
                    <th>Created:</th>
                    <th>Actions:</th>
                </tr>
                <tr>
                    <td>{order.order.restaurantId}</td>
                    <td>{order.order.restaurantName}</td>
                    <td>{order.order.id}</td>
                    <td>{order.order.status}</td>
                    <td>{order.order.total_quantity}</td>
                    <td>{order.order.total_price}</td>
                    <td>{order.order.created_at}</td>
                    <td onClick={() => confirmOrder(order.order.id)}>Confirm</td>
                </tr>
            </table>
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