import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { Artists } from "types/artists";
import { API_URL } from "utils/api";
import { useHttp } from "utils/http";
import {
  useQueryAddConfig,
  useQueryDeleteConfig,
  useQueryEditConfig,
} from "utils/useOpimisticOptions";

// 增
export const useAddArtists = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(
    (params: Partial<Artists>) =>
      http(API_URL.Artist, {
        data: params,
        method: "POST",
      }),
    useQueryAddConfig(queryKey)
  );
};

// 删
export const useDeleteArtists = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(
    (params: Partial<Artists>) =>
      http(`${API_URL.Artist}/${params.id}`, {
        data: params,
        method: "DELETE",
      }),
    useQueryDeleteConfig(queryKey)
  );
};

// 改
export const useEditArtists = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(
    (params: Partial<Artists>) =>
      http(`${API_URL.Artist}/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    useQueryEditConfig(queryKey)
  );
};

// 查
export const useArtists = (param?: Partial<Artists>) => {
  const queryClient = useQueryClient();

  const artistsList: Artists[] =
    queryClient.getQueryData(["artists", param]) || [];

  const handle =
    artistsList.length > 0
      ? () => artistsList
      : () => http(API_URL.Artist, { data: param });

  const http = useHttp();

  return useQuery<Artists[]>(["artists", param], () =>
    // http(API_URL.Artist, { data: param })
    handle()
  );
};

// 查 - single
export const useArtist = (id: number) => {
  const http = useHttp();

  return useQuery<Artists>(
    ["artist", { id }],
    () => http(`${API_URL.Artist}/${id}`),
    {
      enabled: !!id,
    }
  );
};
