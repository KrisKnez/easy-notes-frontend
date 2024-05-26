import { getMeControllerMeQueryKey, useAuthControllerLogout } from "@/api";
import { axiosConfig } from "@/axios";
import { useQueryClient } from "@tanstack/react-query";

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useAuthControllerLogout({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        // This will trigger auth component to consider the user logged out
        queryClient.setQueryData(getMeControllerMeQueryKey(), null);

        // This will delete all cached data so when a new user logs there is no possibility of stale data
        queryClient.invalidateQueries();
      },
      // Simulate delay
      onMutate: () => new Promise((resolve) => setTimeout(resolve, 750)),
    },
  });
};

export default useLogoutMutation;
