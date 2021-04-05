import { useAuth } from "context/authContext";
import qs from "qs";
import { useCallback } from "react";

const API_HOST = process.env.REACT_APP_API_HOST;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

const http = async (
  apiUrl: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  // 处理url 和 body
  if (config.method.toUpperCase() === "GET") {
    apiUrl += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  return window.fetch(`${API_HOST}${apiUrl}`, config).then(async (res) => {
    const data = await res.json();
    if (data.isSuccess) {
      return data.data;
    } else {
      if (data.code === 401) {
        useAuth().logout();
        return Promise.reject("权限不足或过期");
      } else {
        return Promise.reject(data.error);
      }
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();
  return useCallback(
    // (...[apiUrl, config]: Parameters<typeof http>) =>
    (apiUrl: string, config: Config = {}) =>
      http(apiUrl, { ...config, token: user?.token }),
    [user?.token]
  );
};
