import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getSession, signIn, useSession } from "next-auth/react";
import styles from "../styles/Home.module.css";
import Router from "next/router";
import { FormEventHandler, useState } from "react";

const Home: NextPage = () => {

  const { data: session } = useSession();
  const [address, setAddress] = useState({ location: "" });
  const [error, setError] = useState({ error: '', message: '' });
  const [restaurants, setRestaurants] = useState([]);
  const [searching, setIsSearching] = useState(false);

  const searchRestaurants: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!address.location) {
      return setError({
        error: '',
        message: 'Please enter an address'
      });
    }

    setIsSearching(true);
    let body = JSON.stringify({
      location: address.location
    })

    let searchRestaurants = await fetch(`${process.env.NEXT_PUBLIC_API_URL}searchRestaurants`, { body, method: 'POST' })
    let searchRestaurantsResult = await searchRestaurants.json();

    if (searchRestaurantsResult.apiResult.error) {
      const { error, message } = searchRestaurantsResult.apiResult;
      setError({
        error,
        message
      })
    }

    setRestaurants(searchRestaurantsResult.apiResult);
    setIsSearching(false);
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>Hello {session?.user?.name}</div>
        <button type="button" onClick={() => Router.push('/order')}>Create test order </button>

        <div className="restaurant-search-form">
          <form onSubmit={searchRestaurants}>
            <h1>Enter delivery address</h1>
            <input
              value={address.location}
              onChange={({ target }) =>
                setAddress({ ...address, location: target.value })
              }
              type="text"
            //  placeholder="111 Bulgaria blvd, Plovdiv"
            />

            <input type="submit" value="SEARCH" />
          </form>

          {error && <div> {error.message}</div>}
          {searching && <div> Please wait...</div>}

          {restaurants.length > 0 && <div>
            {restaurants.map((restaurant) => (
              <p key={restaurant['id']}>{restaurant['name']}</p>
            ))}
          </div>}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

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
    props: { session }
  }

}

export default Home;
