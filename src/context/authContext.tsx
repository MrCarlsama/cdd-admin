import React, { ReactNode, useState } from "react";
import { UseMutationResult, useQueryClient } from "react-query";
import { Users } from "types/users";
import { useMutation } from "react-query";
import { API_URL } from "utils/api";
import { useHttp } from "utils/http";

const LOCAL_STORAGE_KEY = "__user_info__";

const handleUserResponse = (user: Users) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user) || "");
  return user;
};

type AuthForm = { username: string; password: string };

const logoutHandle = async () =>
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);

const AuthContext = React.createContext<
  | {
      user: Users | null;
      logout: () => Promise<void>;
      useLogin: () => UseMutationResult<void, unknown, AuthForm, unknown>;
      useRegister: () => UseMutationResult<void, unknown, AuthForm, unknown>;
    }
  | undefined
>(undefined);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Users | null>(null);
  const queryClient = useQueryClient();

  const logout = () =>
    logoutHandle().then(() => {
      setUser(null);
      queryClient.clear();
    });

  const useRegister = () => {
    const http = useHttp();
    return useMutation((data: AuthForm) =>
      http(`${API_URL.Users}/login`, {
        data,
        method: "POST",
      })
        .then(handleUserResponse)
        .then(setUser)
    );
  };

  const useLogin = () => {
    const http = useHttp();

    return useMutation((data: AuthForm) =>
      http(`${API_URL.Users}/login`, {
        data,
        method: "POST",
      })
        .then(handleUserResponse)
        .then(setUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, logout, useRegister, useLogin }}
      children={children}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used in AuthProvider");
  }

  return context;
};
