//React
import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppProvider } from "@/nextdoor/context/AppContext";
import { AuthProvider } from "@/nextdoor/context/AuthContext";
import Head from "next/head";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;
  return (
    <>
      <AuthProvider>
        <AppProvider>
          <Head>
            <title>{"Nextdoor"}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossorigin
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
              rel="stylesheet"
            />
            <meta
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
              name="viewport"
            />
            <script
              async
              defer
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkBErYTxs3Rhosq2Z9C3kD2oPMxQV5oa4&libraries=places"
            ></script>
          </Head>
          <Layout>
            <Toaster position="top-right" richColors />
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </AuthProvider>
    </>
  );
}
