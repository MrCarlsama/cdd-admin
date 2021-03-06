import { useQueryDeleteConfig } from "utils/useOpimisticOptions";
import { useHttp } from "utils/http";
import { Photos } from "types/photos";
import { API_URL } from "utils/api";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Pageination, PageinationResult } from "types";
import { useAsync } from "utils/useAsync";

// 查
export const usePhotos = (param?: Pageination<Partial<Photos>>) => {
  const http = useHttp();
  return useQuery<PageinationResult<Photos[]>>(["photos", param], () =>
    http(API_URL.Photos, { data: param })
  );
};

// 批量审核
export const useAuditPhotos = () => {
  const http = useHttp();

  return useMutation((auditList: { id: number; artistIds: number[] }[]) =>
    http(`${API_URL.Photos}/audit`, {
      data: auditList,
      method: "POST",
    })
  );
};

// 重新匹配
export const useAuditPhotosGlobal = () => {
  const http = useHttp();

  const { run, ...result } = useAsync<{ msg: string }>();

  const handle = () => {
    run(http(`${API_URL.Photos}/auditGlobal`, { method: "POST" }));
  };

  return { handle, ...result };
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
};

// 重新匹配
export const usePhotosGlobalReMatch = () => {
  const http = useHttp();

  const { run, ...result } = useAsync<{ msg: string }>();

  const handle = () => {
    run(http(`${API_URL.Photos}/reMatch`, { method: "POST" }));
  };

  return { handle, ...result };
};
