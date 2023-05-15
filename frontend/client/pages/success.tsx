import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

const Success: NextPage<any> = ({ }): JSX.Element => {

  const router = useRouter()


  useEffect(() => {

  });



  return <div>
    Order success page
  </div>
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {

  /** To do 
   * - api call to notify restaurant that order was created
   *  open WS to listen when restaurant confirms order
   *  */
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

    }
  }

}

export default Success;