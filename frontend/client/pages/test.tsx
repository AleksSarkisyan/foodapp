import { useState } from "react";

export default function Test({ user }: any) {

  return (
    <div>{user.token.email}</div>
  )
}

export async function getServerSideProps() {
  // Direct call to external API
  // const options = {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     email: 'webi.aleks@gmail.com',
  //     password: 'test123'
  //   }),
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  // }
  // const response = await fetch('http://localhost:3001/api/v1/user/login', options);
  // const user = await response.json();
  // console.log('user is', user)

  // Using Nest js API routes
  let response = await fetch('http://localhost:3009/api/hello')
  const user = await response.json();
  console.log('user is', user)

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
    restaurantId: 7,
    token: `${user.token.accessToken}`,
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(orderData),
  }
  console.log('options is', options)

  // Using Nest js API routes
  let order = await fetch('http://localhost:3009/api/stripe/checkoutSession', options);
  const redirectUrl = await order.json();

  console.log('redirectUrl is', redirectUrl)

  return {
    redirect: {
      destination: redirectUrl,
      permanent: false,
    },
    props: {
      user
    },
  };
}
