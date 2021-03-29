import { useQueryEditConfig } from "./../../utils/useOpimisticOptions";
import { useHttp } from "utils/http";
import { Photos } from "types/photos";
import { API_URL } from "utils/api";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
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
  // const mutate = async (
  //   auditList: { id: number; artistIds: number[] }[],
  //   param?: Pageination<Partial<Photos>>
  // ) => {
  //   await http(`${API_URL.Photos}/audit`, {
  //     data: auditList,
  //     method: "POST",
  //   });
  // };
  // return mutate;

  return useMutation(
    (auditList: { id: number; artistIds: number[] }[]) =>
      http(`${API_URL.Photos}/audit`, {
        data: auditList,
        method: "POST",
      }),
    useQueryEditConfig(queryKey)
  );
};

// // 改
// export const useEditArtists = (queryKey: QueryKey) => {
//   const http = useHttp();
//   return useMutation(
//     (params: Partial<Artists>) =>
//       http(`${API_URL.Artist}/${params.id}`, {
//         data: params,
//         method: "PATCH",
//       }),
//     useQueryEditConfig(queryKey)
//   );
// };
