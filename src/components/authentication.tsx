import { getUsersMeControllerMeQueryKey, useUsersMeControllerMe } from "@/api";
import { axiosConfig } from "@/axios";
import LoadingLayout from "@/layouts/loading";
import { NextPageWithLayout } from "@/pages/_app";
import { useQueryClient } from "@tanstack/react-query";
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

  const queryClient = useQueryClient();

  // Persisted error is error which is present until a successful response is received.
  // Usually error is present until start of retry which is not ideal for us.
  const [persistedError, setPersistedError] = useState<
    AxiosError | undefined
  >();

  const { data, error, isLoading, status } = useUsersMeControllerMe({
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

  if (!data && !persistedError && isLoading) return <LoadingLayout />;

  if (
    page.authn?.mustBe === "loggedIn" &&
    (error?.response?.status === 401 || error?.response?.status === 403)
  ) {
    router.push("/auth");
    return <LoadingLayout />;
  }

  if (
    page.authn?.mustBe === "notLoggedIn" &&
    !(error?.response?.status === 401 || error?.response?.status === 403) &&
    data
  ) {
    router.push("/dashboard");
    return <LoadingLayout />;
  }

  return children;
};

export default Authentication;
