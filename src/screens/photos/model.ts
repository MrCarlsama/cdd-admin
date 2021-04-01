import {
  useQueryDeleteConfig,
  useQueryEditConfig,
} from "utils/useOpimisticOptions";
import { useHttp } from "utils/http";
import { Photos } from "types/photos";
import { API_URL } from "utils/api";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Pageination } from "types";

// 查
export const usePhotos = (param?: Pageination<Partial<Photos>>) => {
  const http = useHttp();

  return useQuery<Photos[]>(["photos", param], () =>
    http(API_URL.Photos, { data: param })
  );
};

// 批量审核
export const useAuditPhotos = (queryKey: QueryKey) => {
  const http = useHttp();

  return useMutation(
    (auditList: { id: number; artistIds: number[] }[]) =>
      http(`${API_URL.Photos}/audit`, {
        data: auditList,
        method: "POST",
      }),
    useQueryEditConfig(queryKey)
  );
};

// 删
export const useDeletePhotos = (queryKey: QueryKey) => {
  const http = useHttp();
  return useMutation(
    (params: Partial<Photos>) =>
      http(`${API_URL.Photos}/${params.id}`, {
        data: params,
        method: "DELETE",
      }),
    useQueryDeleteConfig(queryKey)
  );
};

// 导出
export const useExportPhotos = () => {
  const http = useHttp();
  return useMutation((param: { artistIds: number[] }) =>
    http(`${API_URL.Photos}/export`, {
      data: param,
      method: "POST",
    })
  );
  // return http(`${API_URL.Photos}/export`, {
  //   data: param,
  //   method: "POST",
  // });
};
