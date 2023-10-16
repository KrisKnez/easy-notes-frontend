import { getUsersMeControllerMeQueryKey, useAuthControllerLogout } from "@/api";
import { axiosConfig } from "@/axios";
import { useQueryClient } from "@tanstack/react-query";

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useAuthControllerLogout({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.refetchQueries(getUsersMeControllerMeQueryKey());
      },
      // Simulate delay
      onMutate: () => new Promise((resolve) => setTimeout(resolve, 750)),
    },
  });
};

export default useLogoutMutation;
