import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
import { getServerSideData } from "@/services/getServerSideData";
import type { GetServerSidePropsContext } from 'next';

let socket: any;
const Success: NextPage<any> = ({ restaurantNotified, restaurantName }): JSX.Element => {

  const [orderConfirmed, setOrderConfirmed] = useState({ orderNumber: null });
  const { data: session } = useSession();

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

    socket.on("connect", () => {
      socket.on("orderConfirmed", (message: any) => {
        let orderConfirmation = JSON.parse(message)

        if (session?.user?.email === orderConfirmation.userEmail) {
          setOrderConfirmed({ orderNumber: orderConfirmation.orderNumber })
        }
      });
    });
  }, [session]);

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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const data = await getServerSideData(context, ['notifyRestaurantProps'])

  if (data[0].hasOwnProperty('redirect')) {
    return data[0];
  }
 
  return {
    props: data[0]
  };
}

export default Success;