import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";


const Protected: NextPage = (): JSX.Element => {
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
      <button type="button" onClick={() => Router.push('/order')}>Create test order </button>
    </div>
  );

};

export default Protected;
