import Authentication from "@/components/authentication";
import "@/styles/globals.css";
import NiceModal from "@ebay/nice-modal-react";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  authn?: {
    mustBe?: "loggedIn" | "notLoggedIn";
  };
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Authentication page={Component}>
        <NiceModal.Provider>
          {getLayout(<Component {...pageProps} />)}
        </NiceModal.Provider>
      </Authentication>
      <Toaster position="bottom-center" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
