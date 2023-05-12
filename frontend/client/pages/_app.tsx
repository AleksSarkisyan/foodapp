import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "../context/modalConext";

function MyApp({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <Component {...pageProps} />
        <div id="modal-root" style={{ position: 'fixed', right: 0, top: 0, height: '100%', width: '300px' }}></div>
      </ModalProvider>
    </SessionProvider>
  );
}

export default MyApp;
