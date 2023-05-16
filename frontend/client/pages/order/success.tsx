import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import io from "socket.io-client";

let socket: any;
const Success: NextPage<any> = ({ restaurantNotified, restaurantName }): JSX.Element => {

  const [orderConfirmed, setOrderConfirmed] = useState({ orderNumber: null });

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

    socket.on("connect", () => {
      socket.on("orderConfirmed", (message: any) => {
        let result = JSON.parse(message)
        setOrderConfirmed({ orderNumber: result.orderNumber })
      });
    });
  }, []);

  return <div>
    Order success page
    {restaurantNotified && !orderConfirmed.orderNumber && (<div>
      <span>We have sent your order to {restaurantName}. Awaiting confirmation.</span>
    </div>)}

    {orderConfirmed.orderNumber && (
      <div>
        <span>Order number {orderConfirmed.orderNumber} confirmed. Await delivery.</span>
      </div>
    )}
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

  let notifyRestaurant = await fetch(`${process.env.NEXT_API_URL}order/notify-restaurant`, req as any)
  let notifyRestaurantResult = await notifyRestaurant.json();

  console.log('notifyRestaurantResult is', notifyRestaurantResult)

  let restaurantNotified = false;
  let restaurantName = null;

  if (notifyRestaurantResult.order.id) {
    restaurantNotified = true
    restaurantName = notifyRestaurantResult.order.restaurantName;
  }

  return {
    props: {
      restaurantNotified,
      restaurantName
    }
  }

}

export default Success;