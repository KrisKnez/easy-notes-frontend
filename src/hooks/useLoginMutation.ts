import { getMeControllerMeQueryKey, useAuthControllerLogin } from "@/api";
import { axiosConfig } from "@/axios";
import { useQueryClient } from "@tanstack/react-query";

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useAuthControllerLogin({
    axios: axiosConfig,
    mutation: {
      onSuccess(data) {
        queryClient.setQueryData(getMeControllerMeQueryKey(), data);
      },
      // Simulate delay
      onMutate: () => new Promise((resolve) => setTimeout(resolve, 750)),
    },
  });
};

export default useLoginMutation;
