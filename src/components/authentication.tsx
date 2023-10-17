import { useUsersMeControllerMe } from "@/api";
import { axiosConfig } from "@/axios";
import LoadingLayout from "@/layouts/loading";
import { NextPageWithLayout } from "@/pages/_app";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface AuthenticationProps {
  children: ReactNode;
  page: NextPageWithLayout;
}

const Authentication = (props: AuthenticationProps) => {
  const { children, page } = props;

  const router = useRouter();

  const { data, error, isLoading, isError } = useUsersMeControllerMe({
    axios: axiosConfig,
    query: {
      retry: false,
    },
  });

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [error, isError]);

  if (isLoading) return <LoadingLayout />;

  const isAuthn = !!data?.data;
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
