import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";
import { IUser } from "../types";

export default function useUser() {
  const { isLoading, data, isError } = useQuery<IUser>(["me"], getMe, {
    retry: false,
    initialData: {
      id: 0,
      last_login: "",
      username: "",
      email: "",
      date_joined: "",
      name: "",
      is_staff: false,
      user_flag: "",
      isLoggedIn: false,
    },
  });

  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: data && data.isLoggedIn,
  };
}
