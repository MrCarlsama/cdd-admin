import qs from "qs";
import { useCallback } from "react";

const API_HOST = process.env.API_HOST;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

const http = (
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

  return window.fetch(`${API_HOST}/${apiUrl}`, config).then(async (res) => {
    const data = await res.json();
    console.log(data);
    if (data.isSuccess) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const useHttp = () => {
  return useCallback(
    (...[apiUrl, config]: Parameters<typeof http>) =>
      http(apiUrl, { ...config }),
    []
  );
};
