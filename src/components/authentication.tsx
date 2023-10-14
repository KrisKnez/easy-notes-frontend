import { useUsersMeControllerMe } from "@/api";
import { axiosConfig } from "@/axios";
import LoadingLayout from "@/layouts/loading";
import { NextPageWithLayout } from "@/pages/_app";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";

export interface AuthenticationProps {
  children: ReactNode;
  page: NextPageWithLayout;
}

const Authentication = (props: AuthenticationProps) => {
  const { children, page } = props;

  const router = useRouter();

  // Persisted error is error which is present until a successful response is received.
  // Usually error is present until start of retry which is not ideal for us and will cause flicker.
  const [persistedError, setPersistedError] = useState<
    AxiosError | undefined
  >();

  const { data, error, status } = useUsersMeControllerMe({
    axios: axiosConfig,
    query: {
      retry: false,
    },
  });
  useEffect(() => {
    switch (status) {
      case "error":
        setPersistedError(error);
        break;
      case "success":
        setPersistedError(undefined);
        break;
    }
  }, [status, error]);

  if (!data && !persistedError) return <LoadingLayout />;

  const isAuthn = persistedError?.response?.status !== 401;

  if (!page.authn)
    if (isAuthn) {
      router.push("/dashboard");
      return <LoadingLayout />;
    } else {
      // !isAuthn
      router.push("/auth");
      return <LoadingLayout />;
    }

  if (page.authn.mustBe === "loggedIn" && !isAuthn) {
    router.push("/auth");
    return <LoadingLayout />;
  }

  if (page.authn.mustBe === "notLoggedIn" && isAuthn) {
    router.push("/dashboard");
    return <LoadingLayout />;
  }

  return children;
};

export default Authentication;
