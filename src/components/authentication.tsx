import { getUsersMeControllerMeQueryKey, useUsersMeControllerMe } from "@/api";
import { axiosConfig } from "@/axios";
import LoadingLayout from "@/layouts/loading";
import { NextPageWithLayout } from "@/pages/_app";
import { CircularProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export interface AuthenticationProps {
  children: ReactNode;
  page: NextPageWithLayout;
}

const Authentication = (props: AuthenticationProps) => {
  const { children, page } = props;

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useUsersMeControllerMe({
    axios: axiosConfig,
    query: {
      retry: false,
      enabled: true,
    },
  });

  // if (!data && !error && isLoading) return <LoadingLayout />;

  if (
    page.authn?.mustBe === "loggedIn" &&
    (error?.response?.status === 401 || error?.response?.status === 403)
  ) {
    router.push("/auth");
    return <CircularProgress />;
  }

  if (
    page.authn?.mustBe === "notLoggedIn" &&
    !(error?.response?.status === 401 || error?.response?.status === 403) &&
    data
  ) {
    router.push("/dashboard");
    return <CircularProgress />;
  }

  return children;
};

export default Authentication;
